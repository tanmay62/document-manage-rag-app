Documentation for Angular Project for Document Management App -
Initially install all libraries viz bootstrap, angular forms etc. for frontend and for backend install express,fs,path,cors,multer. Backend is done using Node.js with mock service.
Then run the project using ng serve command.
First signup page will appear as per routes provide appropriate username, email id and password also confirm password and then signup.
After that you will be redirected to login. Both pages viz. signup and login have redirection link to each at the bottom of form container.
Then login via credentials you signed up with. 
If they are correct, you will redirected to user dashboard where there are multiple actions for user such as document upload and ingestion process. Also there is QnA section to ask questions and get answers.
For now, the QnA functionality is based on Mock Api service which as MockQnA json with respective content and if keywords are relevant, respective description is provided and also the respective document where it is present in mock json is displayed.
For document upload, you can upload documents of any type and then see them in the list below the upload button. Also there are two actions View and Delete to view the respective document in new tab and delete to delete the respective document for respective user.
