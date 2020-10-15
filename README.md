# MTA-Job-Scheduler

Multi-Target Application (MTA) sample using the SAP Cloud Platform Job Scheduler service Node.js library to schedule future, repeating (ex: Webhook), and long running jobs.

## Description

This repository contains a complete Multi-Target Application (MTA) sample project that is an example of using the SAP Cloud Platform Job Scheduler service to schedule the triggering of URLs for future execution, triggering them on a recurring scheduled basis, or to managing the status and completion of long running jobs. It also contains a specific example of how to trigger a build job by simulating a [GitHub Webhook](https://docs.github.com/en/developers/webhooks-and-events/webhooks). The job scheduler service leverages the SAP provided Node.js [@sap/jobs-client](https://www.npmjs.com/package/@sap/jobs-client) library using callbacks (not promises) for calling the async [REST API](https://help.sap.com/viewer/07b57c2f4b944bcd8470d024723a1631/Cloud/en-US/c513d2de49b140d08da694fa263698f8.html).

Much of today's web application programming is designed around a pattern of receiving requests over HTTP, processing the request, and returning a result within a single connection context.  Often this is done based on user activity or during the application processing. However, it is often desired to submit requests for execution at a future time or on a periodic basis. This is where delegating the request triggering to a job schedluler is useful. The job scheduler will makes the request on your behalf at the desired future time. This sample project focuses primarily on this use case.  

Issues also start to arise when the time taken to perform the processing gets increasingly longer.  This can be common when a database must process millions of rows of data or a machine learning algorithm must be trained.  In these longer running cases, the client(browser, mobile app, etc.) will often time out assuming that the connection has been dropped and will no longer wait for the response.  In these cases it is a better design pattern to trigger a job immediately and receive an identifier to that job that can be to on subsequent queries to retrieve (or set) that job's progress.

It is difficult to anticipate exactly how you should handle long running asynchronus jobs. [See this article](https://blog.logrocket.com/node-js-multithreading-what-are-worker-threads-and-why-do-they-matter-48ab102f8b10/) for a detailed discussion of some options using Node.js.  

The long running job example is included in a branch of the repository called [nodejs-wrk](https://github.com/SAP-samples/mta-job-scheduler/tree/nodejs-wrk).

**Note:** Since the nature of using the job scheduler is to trigger jobs that execute in the future or over a long time period, you can't see the evidence of thieir eventual running in a web browser. You must watch the logs of the srv (or wrk) module to see the when they ran and what the results of their running were. When using the SAP Cloud Platform, use the following cf command.

```
cf logs job-sched-srv
```

To simplify testing, a simple job URL is implemented within the app at [/util/date](/util/date) which returns the current server's date and time.

A more complex job URL that simulates the trigginering a GitHub WebHook is found at [/util/trigger](/util/trigger).

## Documentation

The Node.js library is published in the public [NPMjs.com](https://www.npmjs.com/) registry as [@sap/jobs-client](https://www.npmjs.com/package/@sap/jobs-client).  While currently the Readme page focuses on XS Advanced usage, SAP Cloud Platform Cloud Foundry deployment is also supported.

The [Job Scheduler REST APIs](https://help.sap.com/viewer/07b57c2f4b944bcd8470d024723a1631/Cloud/en-US/c513d2de49b140d08da694fa263698f8.html) as used in SAP Cloud Platform are documented under the [API Client Libraries](https://help.sap.com/viewer/07b57c2f4b944bcd8470d024723a1631/Cloud/en-US/b45e08d672fe4e809672e40fe2f3f76b.html) section.

Documentation link for the [Job Scheduler Services in XS Advanced](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.05/en-US/b2aff171211c4a4dbcbb55a7ebf98470.html?q=job%20scheduler) on HANA on-premise. See also [Scheduling Jobs in XS Advanced](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.05/en-US/13b037a505f244bd8bd089ef17f28f19.html).


## Requirements

 - A [SAP Cloud Platorm account](https://account.hana.ondemand.com/) or [SAP Cloud Platfrom Trial account](https://account.hanatrial.ondemand.com/cockpit).

 - A grasp of [micro-services architecture](https://12factor.net/) and a sense of [SAP's Cloud Application Programming model](https://cap.cloud.sap/docs/).
 
 - Sufficent application runtime and jobscheduler quota in the space to which you are deploying.

 - (Optional) Access to a SAP Cloud Platform Continuous Integration and Delivery subscription for Webhook testing.


## Download and Installation

 - Clone this repo [https://github.com/SAP-samples/mta-job-scheduler.git](https://github.com/SAP-samples/mta-job-scheduler.git) into your local system or IDE of choice.

 - Modify the mta.yaml to indicate your APP_URL once it's deployed.  You can additionally set the properties relating to CICD_UI, WEBHOOK_URL, and SECRET_TOKEN if you want to try the scheduled build example (optional).

 ```
...
modules:
 - name: job-sched-srv
   type: nodejs
   path: srv
...
   properties:
      # Find this with 'cf app job-sched-app' on Cloud Foundry or 'xs app job-sched-app --urls' on XSA
      JOB_SCHED_APP_URL: 'https://<subdomain>-dev-job-sched-app.cfapps.<landscape>.hana.ondemand.com'
      # Find this by clicking "Webhook Data" in the "General Information" section of your job Secret:
      JOB_SCHED_CICD_UI: 'https://<subdomain>.cicd.cfapps.<landscape>.hana.ondemand.com/ui/index.html'
      JOB_SCHED_WEBHOOK_URL: 'https://cicd-service.cfapps.<landscape>.hana.ondemand.com/v1/github_events/account/<your-account-guid>'
      JOB_SCHED_SECRET_TOKEN: '<your-webhook-secret-token>'
      NODE_DEBUG: 'scheduler'
...
```
 - OR - after deployment, update the environment for the job-sched-srv module.
 ```
cf set-env job-sched-srv JOB_SCHED_APP_URL 'https://<subdomain>-dev-job-sched-app.cfapps.<landscape>.hana.ondemand.com'
cf set-env job-sched-srv JOB_SCHED_CICD_UI 'https://subdomain.cicd.cfapps.<landscape>.hana.ondemand.com/ui/index.html'
cf set-env job-sched-srv JOB_SCHED_WEBHOOK_URL 'https://cicd-service.cfapps.<landscape>.hana.ondemand.com/v1/github_events/account/<your-account-guid>'
cf set-env job-sched-srv JOB_SCHED_SECRET_TOKEN '<your-webhook-secret-token>'
cf restage job-sched-srv
```

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

## Instructions

Replace occurances of **<landscape>.hana.demand,com** with the landscape region variant for your account. 

See the [COMMANDS](COMMANDS.md) file for comands for building and deploying the project.

If you want to enable multitenant support, follow these steps.

- Uncomment the  **- name: job-sched-reg** resource section of the **mta.yaml** file marked by **MULTITENANT SUPPORT SECTION**
- Uncomment the requires: **- name: job-sched-reg** item in the **mta.yaml** file marked by **MULTITENANT SUPPORT SECTION**
- If using a custom domain, uncomment and adjust the **oauth2-configuration** section in the xsuaa resource config
- Uncomment the section of the **srv/server.js** file marked by **MULTITENANT SUPPORT SECTION**
- Replace the contents of the **app/xs-app.json** file with that of **app/xs-app_mt.json**
- Undeploy/Build/Redeploy the entire app with -e deploy_cf_shr.mtaext (Shared Mode)

```
cf undeploy job-sched -f --delete-services
mbt build -p=cf -t=mta_archives --mtar=job-sched-cf.mtar
cf deploy mta_archives/job-sched-cf.mtar -f -e deploy_cf_shr.mtaext
```


## Limitations

 - Not all features and techniques may be demonstrable with Cloud Foundry trial accounts.


## Known Issues

Multitenancy features to restrict subscriber access to only their jobs needs to be added: See [Multitenancy in Job Scheduler Service](https://help.sap.com/viewer/07b57c2f4b944bcd8470d024723a1631/Cloud/en-US/464b6130857c4bc98af21a0b528cd35a.html)


## How to obtain support

[Create an issue](https://github.com/SAP-samples/mta-job-scheduler/issues) in this repository if you find a bug or have questions about the content.
 
For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html?additionalTagId=723714486627645412834578565527550).
 

## Reporting Problems and Contributing Enhancements

An SAP Code Sample such as this is open software but is not quite a typical full-blown open source project. If you come across a problem, we’d encourage you to check the project’s [issue tracker](https://github.com/SAP-samples/mta-job-scheduler/issues) and to [file a new issue](https://github.com/SAP-samples/mta-job-scheduler/issues/new) if needed. If you are especially passionate about something you’d like to improve, you are welcome to fork the repository and submit improvements or changes as a pull request.


## To-Do (upcoming changes)

Tools used throughout the development of this project are evolving and my change over time. This may result in discrepencies in the exact procedures or screen-clips in the accompanying blog posts. All efforts will be made to update the content in order to keep pace with the toolsing, but cannot be guarenteed.


## Learn more...

Learn more in the help documentation at [Job Scheduler REST APIs](https://help.sap.com/viewer/07b57c2f4b944bcd8470d024723a1631/Cloud/en-US/c513d2de49b140d08da694fa263698f8.html)

A blog post discussing this code sample can be found on the SAP Community. [SAP Cloud Platform Job Scheduler service, I’ll get to that later.](https://blogs.sap.com/2020/08/07/sap-cloud-platform-job-scheduler-service-ill-get-to-that-later./)


## License
Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE file](LICENSES/Apache-2.0.txt).
