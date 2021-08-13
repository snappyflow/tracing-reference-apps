SnappyFlow trace in Apache Thrift in Python
--------------------------------------------
Prerequisite:
•	pip install elastic-apm
•	pip install sf-apm-lib
•	pip install requests
---------------------------------------------
Trace.py file:
---------------
"""
 * Copyright (c) 2021 MapleLabs Inc
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
"""
import elasticapm
from sf_apm_lib import snappyflow


def create_trace():
    """
    Remove curly braces while entering data to variables
    """
    project_name = '{type project_name here}'
    app_name = '{type app_name here}'
    profile_key = '{Paste profile key here}'
    trace_config = snappyflow.get_trace_config(profile_key, project_name, app_name)

    client = elasticapm.Client(service_name="{type service name here}", 

        server_url=trace_config['SFTRACE_SERVER_URL'], 

        verify_cert=trace_config['SFTRACE_VERIFY_SERVER_CERT'], 

        global_labels=trace_config['SFTRACE_GLOBAL_LABELS']

        ) 

    return client
def start_trace(client):
    elasticapm.instrument()
    client.begin_transaction(transaction_type="script")
def end_trace(client, transaction_name):
    client.end_transaction(name= transaction_name, result="success")
----------------------------------------------------------------------------------
 Steps to make thrift trace: -
----------------------------------------------------------------------------------
•	After adding appropriate data to above Trace.py file, place it inside
gen-py (thrift code generated folder using .thrift file).

•	Following code changes need to be done inside service File in gen-py.

•	Let’s assume service name is Example, so the location of file will be in 
gen-py (folder) -> Example(folder) -> Example.py(file).

•	If multiple service is used, each service file should be modified as below.

•	Note: - Lines in bold alone need to be added.

•	Add the following import.
from Trace import create_trace, start_trace, end_trace

•	Next add the create_trace() function in Processor Class init method as below.
--------------------------------------------------------------------------------------------------------------
class Processor(Iface, TProcessor):
    def __init__(self, handler):
        self.client = create_trace()
--------------------------------------------------------------------------------------------------------------
•	start_trace() and end_trace() function should be added to process() function in same Processor class.
--------------------------------------------------------------------------------------------------------------
def process(self, iprot, oprot):
        start_trace(self.client)
        (name, type, seqid) = iprot.readMessageBegin()
        if self._on_message_begin:
            self._on_message_begin(name, type, seqid)
        if name not in self._processMap:
            iprot.skip(TType.STRUCT)
            iprot.readMessageEnd()
            x = TApplicationException(TApplicationException.UNKNOWN_METHOD, 'Unknown function %s' % (name))
            oprot.writeMessageBegin(name, TMessageType.EXCEPTION, seqid)
            x.write(oprot)
            oprot.writeMessageEnd()
            oprot.trans.flush()
            end_trace(self.client, name)
            return
        else:
            self._processMap[name](self, seqid, iprot, oprot)
        end_trace(self.client, name)
        return True
---------------------------------------------------------------------------------------------------------------
•	If server and client are in remote locations, these code changes need to be added to Server side gen-py file.
•	Each function call from client to server will be recorded as transaction and inter call from function ElasticApm instrument supported packages will be taken spans.
