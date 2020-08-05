#### Commands for Build/Deploy to Cloud Foundry(Dedicated Mode):

##### Build Command:
```
mkdir -p mta_archives
mbt build -p=cf -t=mta_archives --mtar=job-sched-cf.mtar
```
##### Deploy Command:
```
cf deploy mta_archives/job-sched-cf.mtar -f -e deploy_cf_ded.mtaext
```
##### Subsequent Build+Deploy Commands:
```
mbt build -p=cf -t=mta_archives --mtar=job-sched-cf.mtar ; cf deploy mta_archives/job-sched-cf.mtar -f -e deploy_cf_ded.mtaext
```
##### Undeploy Command:
```
echo 'Be sure to delete all jobs at /sched/get_all_jobs before undeploying!'
cf undeploy job-sched -f --delete-services
```

#### Commands for Build/Deploy to Cloud Foundry(Shared Mode):

##### Build Command:
```
mkdir -p mta_archives
mbt build -p=cf -t=mta_archives --mtar=job-sched-cf.mtar
```
##### Deploy Command:
```
cf deploy mta_archives/job-sched-cf.mtar -f -e deploy_cf_shr.mtaext
```
##### Subsequent Build+Deploy Commands:
```
mbt build -p=cf -t=mta_archives --mtar=job-sched-cf.mtar ; cf deploy mta_archives/job-sched-cf.mtar -f -e deploy_cf_shr.mtaext
```
##### Undeploy Command:
```
echo 'Be sure to delete all jobs at /sched/get_all_jobs (and subscriptions) before undeploying!'
cf undeploy job-sched -f --delete-services
```

#### Commands for Build/Deploy to HANA XSA:

##### Build Command:
```
mkdir -p mta_archives
mbt build -p=xsa -t=mta_archives --mtar=job-sched-xsa.mtar
```
##### Deploy Command:
```
xs deploy mta_archives/job-sched-xsa.mtar -f -e deploy_xsa.mtaext
```

##### Subsequent Build+Deploy Commands:
```
mbt build -p=xsa -t=mta_archives --mtar=job-sched-xsa.mtar ; xs deploy mta_archives/job-sched-xsa.mtar -f
```

##### Undeploy Command:
```
echo 'Be sure to delete all jobs at /sched/get_all_jobs before undeploying!'
xs undeploy job-sched -f --delete-services
```