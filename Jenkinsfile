pipeline {
    agent any

    environment {
        S3_BUCKET          = 'taskflow-prabhu-rajagopal-2026'
        CLOUDFRONT_DIST_ID = ''                     // fill after CloudFront is verified (terraform output)
        EC2_HOST           = '3.111.51.136'
        EC2_USER           = 'ubuntu'
        BACKEND_PORT       = '5000'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                dir('taskflow-frontend') {
                    bat 'npm install'
                    bat 'npm run build'
                }
            }
        }

        stage('Deploy Frontend to S3') {
            steps {
                dir('taskflow-frontend') {
                    withCredentials([
                        string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
                        string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
                    ]) {
                        bat "aws s3 sync dist/ s3://%S3_BUCKET% --delete"
                    }
                }
            }
        }

        stage('Deploy Backend to EC2') {
            steps {
                dir('taskflow-backend') {
                    withCredentials([sshUserPrivateKey(credentialsId: 'taskflow-ec2-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                        bat """
                            icacls "%SSH_KEY%" /inheritance:r
                            icacls "%SSH_KEY%" /grant:r "SYSTEM:R"
                            ssh -o StrictHostKeyChecking=no -i "%SSH_KEY%" %SSH_USER%@%EC2_HOST% "cd taskflow && git pull origin main"
                            ssh -o StrictHostKeyChecking=no -i "%SSH_KEY%" %SSH_USER%@%EC2_HOST% "cd taskflow/taskflow-backend && npm install && npm run build && pm2 restart taskflow-backend || pm2 start dist/server.js --name taskflow-backend"
                        """
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'TaskFlow deployed successfully!'
        }
        failure {
            echo 'Deployment failed. Check console output above.'
        }
    }
}
