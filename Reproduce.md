## To reproduce Code and server

### MFA - Mobile - 2FA
1. apt install libpam-google-authenticator
2. edit /etc/pam.d add line:
    - auth required pam_google_authenticator.so
3. Might need a restart of service sshd.service
4. edit /etc/ssh/sshd_config edit line:
    - ChallengeResponseAuthentication = yes (default: no )




### General - (project)

1. create folder: ~/media
    - ~/media/series
    - ~/media/movies
    - ~/media/download
2. Create folders: $PROJECT_ROOT/database/
    - /database/data
    - /database/init
    - /database/logs
