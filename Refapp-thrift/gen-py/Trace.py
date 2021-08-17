import elasticapm
from sf_apm_lib import snappyflow

def create_trace():
    print("Trace entered")
    project_name = 'sftrace'
    app_name = 'reference-apps'
    profile_key = 'ExQdG2PEDE8o3XOJ8RPnYU0jfvLDitaIO+rNQ54w0ESpUSwMU2NmLGPS3y4YsmLyhe55+NadzipnZxzqVEiJODOqnj3seRJPMZ0UZ0/33qA7Tah/4Fv2Zzoap+R8cnNDPs2r6MfWpXTKc792UzwF8wpLAsJvdH69Re2VYko8z5sLDd9k4GuZoDYrxMNh/netQKnJsWeACm4Slz4VkIYgKpN9lyAgud6I6BECQUYOu6yfKjRUFhIFIU/NlYivO49oWgtFtv4fye3ovmvDmaxdTcI0CD1C3m8VbAvTf+JVoJHWHlqmpgNWfA2x+amIB8raULzeHFu2ztJGHcIPdp5L6F0snOKrCVplS/UEPiqRPc+cS2PwO5TYYR4WuOeksze8TQr+NvlVN5eW2mqSMSDQhg=='
    trace_config = snappyflow.get_trace_config(profile_key, project_name, app_name)

    client = elasticapm.Client(service_name="thrift-span", 

        server_url=trace_config['SFTRACE_SERVER_URL'], 

        verify_cert=trace_config['SFTRACE_VERIFY_SERVER_CERT'], 

        global_labels=trace_config['SFTRACE_GLOBAL_LABELS']

        ) 

    return client

def start_trace(client):
    elasticapm.instrument()
    print("Trace started")
    client.begin_transaction(transaction_type="script")
    
def end_trace(client, trans_name):
    print("Trace exited")
    client.end_transaction(name=trans_name, result="success")