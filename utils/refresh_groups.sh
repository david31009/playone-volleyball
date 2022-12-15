#!/bin/sh
cd /home/ec2-user/vb_meetup/utils
node create_table.js
node fake_data_generator.js