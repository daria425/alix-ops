# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs -d '\n')
else
  echo ".env file not found!"
  exit 1
fi

PROJECT_ID=$1
REPO_NAME=$2
IMAGE_NAME=$3
IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:latest"

docker build -t $IMAGE_URI .
docker push $IMAGE_URI

gcloud run deploy $IMAGE_NAME \
  --image $IMAGE_URI \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 2.5Gi \
  --set-env-vars ALIX_OPS_DB_NAME=$ALIX_OPS_DB_NAME,REGION=$REGION,CONTROL_ROOM_DB_NAME=$CONTROL_ROOM_DB_NAME,MONGO_URI=$MONGO_URI,PLATFORM_URL=$PLATFORM_URL,SENDGRID_API_KEY=$SENDGRID_API_KEY,ADMIN_PASSWORD=$ADMIN_PASSWORD,GITHUB_TOKEN=$GITHUB_TOKEN

