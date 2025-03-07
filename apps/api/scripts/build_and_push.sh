# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
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
  --set-env-vars "INTERNAL_SERVICE_MONITORING_URL_LIST=${INTERNAL_SERVICE_MONITORING_URL_LIST},ALIX_OPS_DB_NAME=${ALIX_OPS_DB_NAME},CONTROL_ROOM_DB_NAME=${CONTROL_ROOM_DB_NAME},MONGO_URI=${MONGO_URI},PLAYWRIGHT_CLIENT_CREDENTIAL_FILE_PATH=${PLAYWRIGHT_CLIENT_CREDENTIAL_FILE_PATH},FIREBASE_SERVICE_ACCOUNT_KEYFILE_PATH=${FIREBASE_SERVICE_ACCOUNT_KEYFILE_PATH},PLATFORM_URL=${PLATFORM_URL}"


