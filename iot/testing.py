import subprocess


CHANNEL = 7
MON_IFACE = "mon0"
MAC_ADDR = "40:4e:36:5f:96:2e"

def prepare_interface():
    for command in [
        "iw phy phy0 interface add {} type monitor".format( MON_IFACE ),
        "iw dev {} set channel {}".format( MON_IFACE, CHANNEL )
    ]:
        subprocess.call( command )


def sniff( sniff_filter="", interface="", count=20 ):
    iface_flag = "-i" if interface else ""
    # ReMoTe CoDe eXeCuTiOn 
    output = subprocess.check_output("tcpdump {} {} -c {} '{}'".format( iface_flag, interface, count, sniff_filter ), shell=True)
    return output



results = sniff( interface=MON_IFACE,sniff_filter="ether host {}".format( MAC_ADDR)).decode()
print(results)
asdf
abc
