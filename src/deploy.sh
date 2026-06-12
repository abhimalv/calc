echo "pulling the code from git"
git pull

echo "installing dependencies"
npm install 
echo "building the project"
npm run build   
echo "deploying the project"
pm2 restart all
echo "deployment complete"  