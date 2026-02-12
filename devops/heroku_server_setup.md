1. Create Heroku team (with partner credit card entered if possible)
2. Create staging application
  a. Create application called `<partner>_staging`
  b. In Deploy tab, Connect a GitHub repository
  d. In Settings tab, Add buildpacks
  e. Set required environment variables
    1. If you are using private RoleModel packages, you will need to generate a GitHub packages token.
      a. Login as the RMS backup GitHub account
      b. Create a personal access token restricted to only read packages
      c. Save in 1Password
      d. Add token as `GITHUB_PACKAGES_TOKEN` as an environment variable in Heroku
      e. NOTE: Use the same token for both staging and production
  f. Back in Deploy tab, Manually Deploy Branch
