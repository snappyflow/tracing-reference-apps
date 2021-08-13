SnappyFlow trace in Apache Thrift in Python
----------------------------------------
Prerequisite:
--------------
pip install thrift

pip install elastic-apm

pip install sf-apm-lib

pip install requests

Steps to make thrift trace: -
-----------------------------
1)After adding appropriate data to above Trace.py file, placed inside
gen-py (thrift code generated folder using .thrift file).

2)Following code changes need to be done inside service File in gen-py.

3)Let’s assume service name is Example, so the location of file will be in 
gen-py (folder) -> Example(folder) -> Example.py(file).

4)If multiple service is used, each service file should be modified as below.

5)Add the following import.
from Trace import create_trace, start_trace, end_trace

6)Next add the create_trace() function in Processor Class init method as below.

class Processor(Iface, TProcessor):

    def __init__(self, handler):
        self.client = create_trace()

7)start_trace() and end_trace() function should be added to process() function in same Processor class.

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

8)If server and client are in remote locations, these code changes need to be added to Server side gen-py file.

9)Each function call from client to server will be recorded as transaction and inter call from function ElasticApm instrument supported packages will be taken spans.
