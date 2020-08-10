/*eslint no-console: 0*/
"use strict";

var xsenv = require("@sap/xsenv");
var xssec = require("@sap/xssec");
var express = require("express");

xsenv.loadEnv();	// Required for local testing with a default-env.json file

const JobSchedulerClient = require('@sap/jobs-client');
const scheduler = new JobSchedulerClient.Scheduler();

var app = express();

var server = require("http").createServer();
var port = process.env.PORT || 3000;

var global_scheduler_host = "";
var global_run_at = "";
var global_job_id = "";
var global_schedule_id = "";
var global_run_id = "";

app.get("/", function (req, res) {

	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title>job-sched</title></head><body style=\"font-family: Tahoma, Geneva, sans-serif\"><h1>job-sched-worker</h1><br />";
	responseStr += "<a href=\"/wrk/links\">The Links page.</a><br />";
	responseStr += "------<br />";
	responseStr += "<a href=\"/\">Return to home page.</a><br />";
	responseStr += "</body></html>";
	res.status(200).send(responseStr);
});

app.get("/wrk", function (req, res) {

	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title>job-sched</title></head><body style=\"font-family: Tahoma, Geneva, sans-serif\"><h1>job-sched-worker</h1><br />";
	responseStr += "<a href=\"/wrk/links\">The Links page.</a><br />";
	responseStr += "------<br />";
	responseStr += "<a href=\"/\">Return to home page.</a><br />";
	responseStr += "</body></html>";
	res.status(200).send(responseStr);
});

app.get("/wrk/links", function (req, res) {

	var responseStr = "";
	responseStr += "<!DOCTYPE HTML><html><head><title>job-sched</title></head><body style=\"font-family: Tahoma, Geneva, sans-serif\"><h1>job-sched-worker</h1><br />";
	responseStr += "<a href=\"/wrk/date\">Date Test.</a><br />";
	responseStr += "<a href=\"/wrk/test_now\" target=\"test\">test_now</a> Test Now! Monitor with: <strong>cf logs job-sched-wrk</strong><br />";
	responseStr += "<a href=\"/wrk/sleep\" target=\"test\">sleep</a> URL Endpoint that sleeps 30 seconds. Monitor with: <strong>cf logs job-sched-wrk</strong><br />";
	responseStr += "------<br />";
	responseStr += "<a href=\"/\">Return to home page.</a><br />";
	responseStr += "</body></html>";
	res.status(200).send(responseStr);
});

app.get("/wrk/date", function (req, res) {

	var responseStr = "";
	responseStr += new Date().toISOString();
	res.set('Content-Type', 'text/plain');
	res.status(200).send(responseStr);
});


var intervalId = null;
var varCounter = 0;
var varName = function(){
     if(varCounter < 10) {
          varCounter++;
		  /* your code goes here */
		  console.log(process.env.INSTANCE_INDEX + " Finishing in " + (10 - varCounter));
     } else {
          clearInterval(intervalId);
     }
};

function setJobSchedulerStatus () {
	var outStr = "";
	
	var last_scheduler_host = global_scheduler_host;
	var last_run_at = global_run_at;
	var last_job_id = global_job_id;
	var last_schedule_id = global_schedule_id;
	var last_run_id = global_run_id;

	outStr = "start: ";
	outStr += new Date().toISOString();
	console.log(outStr);

	outStr = "last_scheduler_host: " + last_scheduler_host + "";
	console.log(outStr);
	outStr = "last_run_at: " + last_run_at + "";
	console.log(outStr);
	outStr = "last_job_id: " + last_job_id + "";
	console.log(outStr);
	outStr = "last_schedule_id: " + last_schedule_id + "";
	console.log(outStr);
	outStr = "last_run_id: " + last_run_id + "";
	console.log(outStr);

	// Call Job Scheduler to indicate complete
	var responseJSON = {
		message: "none",
	};

	var data = { success: true, message: '"' + "GOOD" + '"' };
	//var data = { success: false, message: "BAD" };

	var suRunLog = { 
		jobId: last_job_id, 
		scheduleId: last_schedule_id,
		runId: last_run_id,
		data: data
	};

	scheduler.updateJobRunLog(suRunLog, (error, result) => {
	
		if (error) {
			console.log('Error update run log: %s', error);
		}
		else {
			console.log('OK update run log: %s', result);
			outStr = "  end: ";
			outStr += new Date().toISOString();
			console.log(outStr);

			global_scheduler_host = "";
			global_run_at = "";
			global_job_id = "";
			global_schedule_id = "";
			global_run_id = "";
		
		}
		return null;
	});

}

app.get("/wrk/sleep", function (req, res) {

	var Secs = 30;
	var mSecs = Secs * 1000;
	var outStr = "";
	var responseStr = "";
	var extras = [];

	// "x-sap-job-id": "110341",
	// "x-sap-job-run-id": "89bcad0f-782d-4f12-9cfe-dafca51ab5ef",
	// "x-sap-job-schedule-id": "becbb91d-701a-46ec-8262-39f150ff7eb0",
	// "x-sap-run-at": "2020-08-03 18:06:17",
	// "x-sap-scheduler-host": "https://jobscheduler-rest.cfapps.us10.hana.ondemand.com",

	if (typeof req.headers['x-sap-scheduler-host'] !== "undefined") {
		global_scheduler_host = req.headers['x-sap-scheduler-host'];
		global_run_at = req.headers['x-sap-run-at'];
		global_job_id = req.headers['x-sap-job-id'];
		global_schedule_id = req.headers['x-sap-job-schedule-id'];
		global_run_id = req.headers['x-sap-job-run-id'];
		
		outStr = "headers: " + JSON.stringify(req.headers) + "\n";
		responseStr += outStr;
		responseStr += "\n";
		console.log(outStr);

		outStr = "sleep: " + Secs + " seconds...";
		responseStr += outStr;
		responseStr += "\n";
		console.log(outStr);
		outStr = "start: ";
		outStr += new Date().toISOString();
		console.log(outStr);
		responseStr += outStr;
		responseStr += "\n";

		setTimeout(setJobSchedulerStatus, mSecs);
		intervalId = setInterval(varName, (mSecs / 10));

		outStr = "  end: ";
		outStr += new Date().toISOString();
		responseStr += outStr;
		console.log(outStr);

		responseStr = "OK";
		res.set('Content-Type', 'text/plain');
		res.status(202).send(responseStr);  // Notice 202 not 200

	}
	else {
		responseStr  = "When called by the Job Scheduler Service, this endpoint will sleep 30 seconds and then update the run log.\n";
		responseStr += "You can monitor it's progress by watching the logs with this command.\n";
		responseStr += "\n";
		responseStr += "cf logs job-sched-wrk\n";
		res.set('Content-Type', 'text/plain');
		res.status(200).send(responseStr);  // Notice 202 not 200
	}

});

// /wrk/test_now
app.get("/wrk/test_now", function (req, res) {

	var responseJSON = {
		message: "none",
	};
	var jobName = "Test";
	var instanceNumber = process.env.INSTANCE_INDEX;
	console.log("hdrs:" + JSON.stringify(req.headers,null,2));
	var runDate = new Date();
	var hostname = req.hostname;
	hostname = "conciletime-dev-job-sched-wrk.cfapps.us10.hana.ondemand.com";
	var myJob = 
	{
	"name": jobName + "_" + instanceNumber + "_" + runDate.getHours() + "_" + runDate.getMinutes() + "_" + runDate.getSeconds(),
	"description": "asynchronous job created by test_now",
	"action": "https://" + hostname + "/wrk/sleep",
	"active": true,
	"httpMethod": "GET",
	"startTime": null,
	"endTime": null,
	"schedules": [
		{
			"time": runDate.toISOString(),
			"active": true
		}
	]
	};

	if (global_scheduler_host === "") {
		var scJob = { job: myJob };

		scheduler.createJob(scJob, (error, body) => {
		
			if (error) {
				console.log('Error creating job: %s', error);
				responseJSON.message = error;
				return res.json(responseJSON);
			}
			else {
				let resp_jobId = body._id;
				let resp_scheduleId = body.schedules[0].scheduleId;
				let resp_runId = "blah";
				console.log('OK creating job: %s', body);
				responseJSON = body;
				return res.json(responseJSON);
			}
			return null;
		});
		
	}
	else {
		var error = { message: "Instance " + instanceNumber + " is busy.  Might want to create more."};
		console.log('Error creating job: %s', error);
		responseJSON.message = error;
		return res.json(responseJSON);
	}

});

server.on("request", app);

server.listen(port, function () {
	console.info("Backend: " + server.address().port);
});
