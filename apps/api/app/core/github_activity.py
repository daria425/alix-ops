from dotenv import load_dotenv
import os, sys

sys.path.insert(0, os.path.abspath(os.getcwd()))
from app.utils.logger import logger
import requests
load_dotenv()
GITHUB_TOKEN=os.getenv("GITHUB_TOKEN")

def get_commits(owner, repo):
    base_url="https://api.github.com/repos"
    response=requests.get(f"{base_url}/{owner}/{repo}/commits", headers={"Authorization": f"token {GITHUB_TOKEN}"})
    if response.status_code==200:
        return response.json()
    else:
        logger.error(f"Failed to fetch commits: {response.status_code} - {response.text}")
        return None
    

owner='ProjectAlix'
repo='alix-whatsapp-flows'
commits=get_commits(owner, repo)
print(commits)