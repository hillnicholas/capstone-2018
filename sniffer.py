#!/usr/bin/env python3


import subprocess
import re
import os
import time

CHANNEL = 7
SEARCH_ADDR = "40:4e:36:5f:96:2e"


class Sniffer:

    def __init__( self,  channel, mon_iface, search_addr  ):
        self.channel = channel
        self.mon_iface = mon_iface
        self.search_addr = search_addr
        self.timeout = 5

    def _prepare_interface(self):
        for command in [
            "iw phy phy0 interface add {} type monitor".format( self.mon_iface ),
            "iw dev {} set channel {}".format( self.mon_iface , self.channel )
        ]:
            subprocess.call( command, shell = True, stderr=open(os.devnull, 'w'))


    def _sniff( self, sniff_filter="", interface="", count=20 ):
        iface_flag = "-i" if interface else ""
        # ReMoTe CoDe eXeCuTiOn 
        output = subprocess.check_output("timeout {} /usr/sbin/tcpdump {} {} -c {} '{}'".format( self.timeout, iface_flag, interface, count, sniff_filter ),stderr=open(os.devnull, 'w'), shell=True)
        return output.decode()



    def start( self ):
        self._prepare_interface()
        raw_results = self._sniff( interface=self.mon_iface, sniff_filter="ether host {} ".format(self.search_addr ) )

        results = list() 
        for row in raw_results.split('\n'):
            match = re.search('([0-9]{1,3})dBm', row )
            if match:
                results.append( { "address" : self.search_addr, "power" : -1 * int(match.group(1)) } )
        self.data_points = results
        self.average_power = sum( list(data["power"] for data in results )) / len( results )
