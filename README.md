# MTA-Job-Scheduler

Multi-Target Application(MTA) sample using the SAP Cloud Platform Job Scheduler service Node.js library to schedule future, repeating(ex: Webhook), and long running jobs.

## Description

This repository contains a complete Multi-Target Application(MTA) sample project that is an example of using the SAP Cloud Platform Job Scheduler service to schedule the triggering of URLs for future execution, triggering them on a recurring scheduled basis, or to manage the status and completion of long running jobs.  It also contains a specific example how to trigger a build job by simulating a GitHub Webhook.  The job scheduler service leverages the SAP Node.js [@sap/jobs-client](https://www.npmjs.com/package/@sap/jobs-client) library using callbacks(not promises) for calling the async [REST API](https://help.sap.com/viewer/07b57c2f4b944bcd8470d024723a1631/Cloud/en-US/c513d2de49b140d08da694fa263698f8.html).

Much of today's web application programming is designed around a pattern of receiving requests over HTTP, processing the request, and returning a result within a single connection context.  Often this is done based on user activity or during the processing of an application.  However, it is often desired to submit requests at a future time or on a periodic basis.  This is where delegating the request processing to a job schedluler is useful.  This way the job scheduler makes the request on your behalf.  As long as the requests are processed in a reasonably short time frame (<30 seconds) the HTTP request will remain open.  This sample project focuses primarily on this use case.  

Issues start to arise when the time taken to perform the processing gets increasingly longer.  This can be common when a database must process millions of rows of data or a machine learning algorithm must be trained.  In these longer running cases, the client(browser, mobile app, etc) will often time out assuming that the connection has been dropped and will no longer wait for the response.  In these cases it is a better design pattern to trigger a job immediately and receive an identifier to that job that can be to on subsequent queries to retrieve(or set) that job's progress.

It is difficult to anticipate exactly how you should handle long running asynchronus jobs.  [See this article](https://blog.logrocket.com/node-js-multithreading-what-are-worker-threads-and-why-do-they-matter-48ab102f8b10/) for a detailed discussion of some options with Node.js.  

The long running job example is included in a branch of the repository called [nodejs-wrk](/tree/nodejs-wrk).

Note:  Since the nature of using the job scheduler is to trigger jobs that execute in the future or over a long time period, you can't see the evidence of thieir eventual running in a web browser.  You must watch the logs of the srv(or wrk) module to see the when they ran and what the results of their running were.  Do this with the following cf command.

```
cf logs job-sched-srv
```

A simple job URL is implemented within the app at [/util/date](/util/date) which returns the current server's date and time.

A more complex job URL that simulates the trigginering a GitHub WebHook is found at [/util/trigger](/util/trigger).

## Documentation

The Node.js library is published in the public [NPMjs.com](https://www.npmjs.com/) registry as [@sap/jobs-client](https://www.npmjs.com/package/@sap/jobs-client).  While currently the Readme page focuses on XS Advanced usage, SAP Cloud Platform Cloud Foundry deployment is also supported.

The [Job Scheduler REST APIs](https://help.sap.com/viewer/07b57c2f4b944bcd8470d024723a1631/Cloud/en-US/c513d2de49b140d08da694fa263698f8.html) as used in SAP Cloud Platform are documented under the [API Client Libraries](https://help.sap.com/viewer/07b57c2f4b944bcd8470d024723a1631/Cloud/en-US/b45e08d672fe4e809672e40fe2f3f76b.html) section.

Documentation link for the [Job Scheduler Services in XS Advanced](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.05/en-US/b2aff171211c4a4dbcbb55a7ebf98470.html?q=job%20scheduler) on HANA on-premise.  See also [Scheduling Jobs in XS Advanced](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.05/en-US/13b037a505f244bd8bd089ef17f28f19.html).


## Requirements

 - A [SAP Cloud Platorm account](https://account.hana.ondemand.com/) or [SAP Cloud Platfrom Trial account](https://account.hanatrial.ondemand.com/cockpit).

 - A grasp of [micro-services architecture](https://12factor.net/) and a sense of [SAP's Cloud Application Programming model](https://cap.cloud.sap/docs/).

 - (Optional) Access to a SAP Cloud Platform Continuous Integration and Delivery subscription for Webhook testing.


## Download and Installation

 - Clone this repo [https://github.com/SAP-samples/mta-job-scheduler.git](https://github.com/SAP-samples/mta-job-scheduler.git) into your local system or IDE of choice.

 - Modify the mta.yaml to specify your specific CI/CD configuration(optional).

 ```
...
modules:
 - name: job-sched-srv
   type: nodejs
   path: srv
...
   properties:
      # Find this by clicking "Webhook Data" in the "General Information" section of your job Secret:
      CICD_UI: 'https://subdomain.cicd.cfapps.us10.hana.ondemand.com/ui/index.html'
      WEBHOOK_URL: 'https://cicd-service.cfapps.us10.hana.ondemand.com/v1/github_events/account/6e3ca693-use-your-account-9c30-254a18b59a55'
      SECRET_TOKEN: '234ed9950replacewithyoursecrettoken08af322deb73efddf'
      NODE_DEBUG: 'scheduler'
...
```
 - OR after deployment, update the environment for the job-sched-srv module.
 ```
cf set-env job-sched-srv CICD_UI 'https://subdomain.cicd.cfapps.us10.hana.ondemand.com/ui/index.html'
cf set-env job-sched-srv WEBHOOK_URL 'https://cicd-service.cfapps.us10.hana.ondemand.com/v1/github_events/account/6e3ca693-use-your-account-9c30-254a18b59a55'
cf set-env job-sched-srv SECRET_TOKEN '234ed9950replacewithyoursecrettoken08af322deb73efddf'
cf restage job-sched-srv
```

## Instructions

Replace occurances of "us10.hana.demand,com" with the landscape region variant for your account. 

See the [COMMANDS](COMMANDS.md) file for comands for building and deploying the project.

If you want to enable multitenant support, follow these steps.

- Uncomment the  **- name: job-sched-reg** resource section of the mta.yaml file marked by **MULTITENANT SUPPORT SECTION**
- Uncomment the requires: **- name: job-sched-reg** item in the mta.yaml file marked by **MULTITENANT SUPPORT SECTION**
- Uncomment the section of the srv/server.js file marked by **MULTITENANT SUPPORT SECTION**
- Replace the contents of the app/xs-app.json file with that of app/xs-app_mt.json
- Undeploy/Build/Redeploy the entire app


## Limitations

 - Not all features and techniques may be demonstrable with Cloud Foundry trial accounts.

## Known Issues

This example project contains no known issues.

## How to obtain support

This project is provided "as-is" with no expectation for major changes or support.  However, you may attempt to contact the repo owner with questions.

## Contributing

Contributions are currently not being accepted since the project is provided on an "as-is" basis.  You may fork the repo and modify it and create a pull request for consideration.

## To-Do (upcoming changes)

Tools used throughout the development of this project are evolving and my change over time.  This may result in discrepencies in the exact procedures or screen-clips in the accompanying blog posts.  All efforts will be made to update the content in order to keep pace with the toolsing, but cannot be guarenteed.

## Learn more...

Learn more in the help documentation at [Job Scheduler REST APIs](https://help.sap.com/viewer/07b57c2f4b944bcd8470d024723a1631/Cloud/en-US/c513d2de49b140d08da694fa263698f8.html)

## Project Structure

File / Folder | Purpose
---------|----------
`README.md` | this getting started guide
`COMMANDS.md` | commands for building/deploying 
`app/` | content for UI frontends go here
`srv/` | your service module code goes here
`mta.yaml` | project structure and relationships
`deploy_*.mtaext` | MTA Extension files for deploying
`package.json` | project metadata and configuration

## License
 Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE file](LICENSE).
