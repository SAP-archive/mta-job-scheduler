# Job-Scheduler

Simple NodeJS Multi-Target Application example of using the jobscheduler service in CF and XSA

[Docs for CF](https://help.sap.com/viewer/07b57c2f4b944bcd8470d024723a1631/Cloud/en-US/c513d2de49b140d08da694fa263698f8.html)

[Docs for XSA](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.05/en-US/b2aff171211c4a4dbcbb55a7ebf98470.html?q=job%20scheduler)

## Description

This repository contains a complete Multi-Target Application(MTA) project that is an example of using the jobscheduler service to schedule the triggering of URLs in the future or on a recurring scheduled basis.  It also demonstrates how to trigger and interact with long-running tasks(currently unimplemented).  It leverages the SAP NodeJS [@sap/jobs-client](https://www.npmjs.com/package/@sap/jobs-client) library using callbacks(not promises) for calling the async [REST API](https://help.sap.com/viewer/07b57c2f4b944bcd8470d024723a1631/Cloud/en-US/c513d2de49b140d08da694fa263698f8.html).

While much of today's application programming is designed around a pattern of receiving requests over HTTP, processing the request, and returning a result within a single connection context, issues start to arise when the time taken to perform the processing gets increasingly longer.  In these longer running requests, the client(browser, mobile app, etc) will often time out assuming that the connection has been dropped and will no longer wait for the response.  In these cases it is a better design pattern to trigger a job immediately receive an identifier to that job that can be used on subsequent queries of that job's progress.

A simple job URL is implemented within the app at /util/date which return the current server's date and time.

A more complex job URL that simulates a the trigginering a GitHub WebHook is found at /util/bump.


## Requirements

 - A productive [Cloud Foundry account provided by SAP Cloud Platorm](https://help.sap.com/viewer/product/CP/) or trial account [https://help.sap.com/viewer/product/CP/](Trial Link).

 - A grasp of [micro-services architecture](https://12factor.net/) and a sense of [SAP's Cloud Application Programming model](https://cap.cloud.sap/docs/).

 - (Optional) Access to a SAP CI/CD instance for WebHook testing.

## Download and Installation

 - Clone this repo [https://github.com/SAP-samples/mta-job-scheduler.git](https://github.com/SAP-samples/mta-job-scheduler.git) into your local system or IDE of choice.

 - Either modify the mta.yaml to specify your specific CI/CD configuration.

 ```
...
modules:
 - name: job-sched-srv
   type: nodejs
   path: srv
...
   properties:
      # Find this by clicking "Webhook Data" in the "General Information" section of your job Secret:
      CICD_UI: 'https://conciletime.cicd.cfapps.us10.hana.ondemand.com/ui/index.html'
      WEBHOOK_URL: 'https://cicd-service.cfapps.us10.hana.ondemand.com/v1/github_events/account/6e3ca693-c112-4862-9c30-254a18b59a55'
      SECRET_TOKEN: '234ed9950a29c0aa969756550b73887938e0e25454b576d08af322deb73efddf'
      NODE_DEBUG: 'scheduler'
...
```
 - OR after depoyment, update the environment for the job-sched-srv application.
 ```
cf set-env job-sched-srv CICD_UI 'https://subdomain.cicd.cfapps.us10.hana.ondemand.com/ui/index.html'
cf set-env job-sched-srv WEBHOOK_URL 'https://cicd-service.cfapps.us10.hana.ondemand.com/v1/github_events/account/abcde-0123456789'
cf set-env job-sched-srv SECRET_TOKEN '234ed9950replacewithyoursecrettoken08af322deb73efddf'
cf restage job-sched-srv
```
 
## Limitations

 - Not all features and techniques may be demonstorable with Cloud Foundry trial accounts.
 - Long-running task support is currently not demonstrated in this example.

## Known Issues

This example project contains no known issues.

## How to obtain support

This project is provided "as-is" with no expectation for major changes or support.  However, you may attempt to contact the repo owner with questions.

## Contributing

Contributions are currently not being accepted since the project is provided on an "as-is" basis.  You may fork the repo and modify it and create a pull request for consideration.

## To-Do (upcoming changes)

Tools used throughout the development of this project are evolving and my change over time.  This may result in discrepencies in the exact procedures or screen-clips in the accompanying blog posts.  All efforts will be made to update the content in order to keep pace with the toolsing, but cannot be guarenteed.

## Learn more...

Learn more at [https://github.wdf.sap.corp/pages/jobscheduler/docs/](https://github.wdf.sap.corp/pages/jobscheduler/docs/) (internal)

## Project Structure

File / Folder | Purpose
---------|----------
`README.md` | this getting started guide
`app/` | content for UI frontends go here
`srv/` | your service module code goes here
`mta.yaml` | project structure and relationships
`deploy_*.mtaext` | MTA Extension files for deploying
`package.json` | project metadata and configuration

## License
 Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE file](LICENSE).

### Build Command:
```
mkdir -p mta_archives
--then--
mbt build -p=xsa -t=mta_archives --mtar=job-sched-xsa.mtar
--or--
mbt build -p=cf -t=mta_archives --mtar=job-sched-cf.mtar
```

### Deploy Command:
```
xs deploy mta_archives/job-sched-xsa.mtar -f -e deploy_xsa.mtaext
--or--for--dedicated
cf deploy mta_archives/job-sched-cf.mtar -f -e deploy_cf_ded.mtaext
--or--for--shared
cf deploy mta_archives/job-sched-cf.mtar -f -e deploy_cf_shr.mtaext
```

### Subsequent Build+Deploy Commands:
```
mbt build -p=xsa -t=mta_archives --mtar=job-sched-xsa.mtar ; xs deploy mta_archives/job-sched-xsa.mtar -f
--or--
mbt build -p=cf -t=mta_archives --mtar=job-sched-cf.mtar ; cf deploy mta_archives/job-sched-cf.mtar -f -e deploy_cf_ded.mtaext
```

### Undeploy Command:
```
xs undeploy job-sched -f --delete-services
--or--
cf undeploy job-sched -f --delete-services
```