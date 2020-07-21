# Job-Scheduler

Simple NodeJS Multi-Target Application(MTA) example of using the jobscheduler service in CF and XSA.


## Description

This repository contains a complete project Multi-Target Application(MTA) that is an example of using the jobscheduler service to manage long running tasks or trigger recurring tasks on a specific schedule.

While much of today's application programming is designed around a pattern of receiving requests over HTTP, processing the request, and returning a result within a single connection context, issues start to arise when the time taken to perform the processing gets increasingly longer.  In these longer running requests, the client(browser, mobile app, etc) will often time out assuming that the connection has been dropped and will no longer wait for the response.  In these cases it is a better design pattern to trigger a job immediately receive an identifier to that job that can be used on subsequent queries of that job's progress.

The same mechanism is used to schedule the execution of unattended jobs that are triggered at a particular time in the future or on a recurring schedule.


[Docs for CF](https://help.sap.com/viewer/07b57c2f4b944bcd8470d024723a1631/Cloud/en-US/c513d2de49b140d08da694fa263698f8.html)

[Docs for XSA](https://help.sap.com/viewer/4505d0bdaf4948449b7f7379d24d0f0d/2.0.05/en-US/b2aff171211c4a4dbcbb55a7ebf98470.html?q=job%20scheduler)


## Requirements

 - A productive [Cloud Foundry account provided by SAP Cloud Platorm](https://help.sap.com/viewer/product/CP/).

 - A grasp of [micro-services architecture](https://12factor.net/) and a sense of [SAP's Cloud Application Programming model](https://cap.cloud.sap/docs/).

## Download and Installation

 - Clone this repo [https://github.com/SAP-samples/mta-job-scheduler.git](https://github.com/SAP-samples/mta-job-scheduler.git) into your local system or IDE of choice.
 
## Limitations

 - Not all features and techniques will be demonstorable with Cloud Foundry trial accounts.

## Known Issues

This example project contains no known issues.

## How to obtain support

This project is provided "as-is" with no expectation for major changes or support.  However, you may attempt to contact the repo owner with questions.

## Contributing

Contributions are currently not being accepted since the project is provided on an "as-is" basis.

## To-Do (upcoming changes)

Tools used throughout the development of this project are evolving and my change over time.  This may result in discrepencies in the exact procedures or screen-clips in the accompanying blog posts.  All efforts will be made to update the content in order to keep pace with the toolsing, but cannot be guarenteed.

## Learn more...

Learn more at https://cap.cloud.sap/docs/get-started/

## Project Structure

File / Folder | Purpose
---------|----------
`README.md` | this getting started guide
`app/` | content for UI frontends go here
`db/` | your domain models and data go here
`srv/` | your service models and code go here
`mta.yaml` | project structure and relationships
`package.json` | project metadata and configuration
`.cdsrc.json` | hidden project configuration
`xs-security` | security profile configuration

## License
 Copyright (c) 2020 SAP SE or an SAP affiliate company. All rights reserved. This file is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE file](LICENSE).

