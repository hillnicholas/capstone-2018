#!/usr/bin/env python3


from flask import Flask, request
import sniffer
import json
import re

app = Flask(__name__)
MON_IFACE = "mon0"

@app.route('/rest/data')
def get_data_from_sniffer():
    mac_addr = request.args.get('mac_addr', '')
    channel = request.args.get('channel', '' )

    if not re.match('[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}:[0-9a-f]{2}', mac_addr ) or not re.match('[0-9]{1,2}', channel ):
        return json.dumps({})
    print( "mac addr: {}\tchannel: {}".format( mac_addr, channel ) )
    s = sniffer.Sniffer(channel, MON_IFACE, mac_addr)
    s.start()
    return json.dumps( {
        "mac_addr" : mac_addr, 
        "averagePower" : s.average_power,
        "dataPoints" : s.data_points
    } )




if __name__ == "__main__":
    app.run( host='0.0.0.0', debug=True )