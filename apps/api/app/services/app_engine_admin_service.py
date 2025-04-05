from google.cloud import appengine_admin_v1
from datetime import datetime, timedelta
import json, os
current_dir = os.path.dirname(os.path.abspath(__file__))
gcloud_projects_config_file_path=os.path.join(current_dir, "gcloud_projects_config.json")
with open(gcloud_projects_config_file_path, "r") as f:
    gcloud_projects_config=json.loads(f.read())
class AppEngineAdminService:
    def __init__(self):
        self.version_client = appengine_admin_v1.VersionsClient()
    
    def list_app_engine_versions(self, project_id, service_id, days=7):
        request = appengine_admin_v1.ListVersionsRequest(parent=f"apps/{project_id}/services/{service_id}")
        results = self.version_client.list_versions(request=request)
        versions = []
        cutoff_time = (datetime.now() - timedelta(days=days)).timestamp()
        for result in results:
            version_time = result.create_time.timestamp()
            
            # Skip versions older than cutoff_time if it's set
            if cutoff_time and version_time < cutoff_time:
                continue
                
            version = {
                "name": result.name,
                "id": result.id,
                "created_at": version_time,
            }
            versions.append(version)
        return versions
    
    def get_latest_app_engine_deployments(self):
        """Get the latest App Engine deployments for all GAE services across projects.
        
        Returns:
            dict: A structured response containing:
                - deployments: List of latest deployment details for each service
                - summary: Summary statistics about the deployments
        """
        gae_projects = [
            project for project in gcloud_projects_config
            if any(service['service_type'] == 'gae_application' for service in project['services'])
        ]
        
        deployments = []
        total_services = 0
        services_with_deployments = 0
        
        for project in gae_projects:
            project_id = project['project_id']
            project_name = project.get('friendly_name', project_id)
            
            for service in project['services']:
                if service['service_type'] == 'gae_application':
                    total_services += 1
                    service_id = service['service_id']
                    
                    versions = self.list_app_engine_versions(project_id, service_id)
                    if versions:
                        services_with_deployments += 1
                        print(versions)
                        latest_version = max(versions, key=lambda x: x['created_at'])
                        
                        # Add formatted datetime for display
                        created_dt = datetime.fromtimestamp(latest_version['created_at'])
                        latest_version['created_at'] = created_dt.strftime('%Y-%m-%d %H:%M:%S')
                        
                        deployments.append({
                            'project_id': project_id,
                            'latest_version':{
                            'project_name': project_name,
                            'service_id': service_id,
                            'version': latest_version['id'],
                            'created_at': latest_version['created_at'],
                            'version_details': latest_version}, 
                            'versions': versions
                        })
        sorted_deployments = sorted(
            deployments, 
            key=lambda x: x['latest_version']['created_at'] if x['latest_version']['created_at'] is not None else 0,
            reverse=True
        )
        return {
            'deployments': sorted_deployments,
            'summary': {
                'total_services': total_services,
                'services_with_deployments': services_with_deployments,
                'services_without_deployments': total_services - services_with_deployments
            }
        }
