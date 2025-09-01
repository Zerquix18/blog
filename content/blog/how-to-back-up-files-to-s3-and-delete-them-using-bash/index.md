---
title: How To Back Up Files to S3 And Delete Them Using Bash
description: A simple bash script to send files to S3 and then upon confirmation, delete them from the local machine.
date: "2022-04-03 00:00 AST"
tags: aws, s3, bash, backup
---

You have a situation. Your machine is filling up with files - could be logs, could be important data that you no longer need after sometime, and you need to get rid of them. You don't want to delete them permanently because you're unsure if you're going to need them in the future. Why not back them up to S3, which is very cheap, and at the same time delete them from the local machine?

```bash
#!/bin/bash

time_in_the_past=604800 # 1 week in seconds
directory="./"
bucket_name=""
bucket_path="/"

current_time=$(date +"%s")
while read -d '' file; do
  mtime=$(stat -c %Y $file)
  difference=$((current_time-mtime))

  if [ "$difference" -gt "$time_in_the_past" ]; then
    echo "Backing up $file"
    aws s3 cp $file s3://$bucket_name$bucket_path && unlink $file
  fi
done < <(find $directory -type f -print0)
```

This script will read the files in a directory, check that they're older than a specified time, upload them to S3 and if successfully, delete them from the local machine. This script assumes you installed and configured the [AWS CLI](https://aws.amazon.com/cli/).

There are 4 variables at the top that control how it will behave:
* **time_in_the_past** is a week in seconds, but you can change this to any value.
* **directory** is the directory where the backups will happen.
* **bucket_name** The bucket name in which the files will be uploaded. (a-z0-9_-)
* **bucket_path** The path inside the bucket where the files will be placed.

You can save this file as `cleanup.sh` and then run it every X amount of time using crontab. To open crontab, you can run

```crontab -e```

Then choose your preferred editor (I usually go for nano). Then place the crontab line at the end:

```30 6 * * sun /path/to/cleanup.sh```

The `30 6 * * sun` means every sunday at 6:30 am. You can visualize cron expressions with this amazing tool called [cron guru](https://crontab.guru/#30_6_*_*_sun).
