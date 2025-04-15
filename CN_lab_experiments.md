CN lab experiments



## Wired

set ns \[new Simulator\]

set tracefile \[open out.tr w\]  
$ns trace-all $tracefile

set namfile \[open out.nam w\]  
$ns namtrace-all $namfile

set n0 \[$ns node\]  
set n1 \[$ns node\]  
set n2 \[$ns node\]

$ns duplex-link $n0 $n1 1Mb 10ms DropTail  
$ns duplex-link $n1 $n2 1Mb 10ms DropTail

$ns queue-limit $n0 $n1 10  
$ns queue-limit $n1 $n2 10

set tcp \[new Agent/TCP\]  
$ns attach-agent $n0 $tcp  
set sink \[new Agent/TCPSink\]  
$ns attach-agent $n2 $sink  
$ns connect $tcp $sink

set ftp \[new Application/FTP\]  
$ftp attach-agent $tcp  
$ftp set type\_ FTP

$ns at 0.1 "$ftp start"  
$ns at 4.0 "$ftp stop"  
$ns at 5.0 "finish"

proc finish {} {  
    global ns tracefile namfile  
    $ns flush-trace  
    close $tracefile  
    close $namfile  
    exec nam out.nam &  
    exit 0  
}

$ns run

BEGIN {  
    total\_bytes \= 0;  
    start\_time \= 0;  
    end\_time \= 0;  
}

$1 \== "s" && start\_time \== 0 {  
    start\_time \= $2;  
}

$1 \== "r" {  
    total\_bytes \+= $8;  \# Assuming $8 is the size of the packet  
    end\_time \= $2;  
}

END {  
    duration \= end\_time \- start\_time;  
    if (duration \> 0\) {  
        throughput \= (total\_bytes \* 8\) / (duration \* 1000000);  \# Throughput in Mbps  
        print "Throughput: " throughput " Mbps";  
    } else {  
        print "No packets received.";  
    }  
}



## Wireless


set val(chan)           Channel/WirelessChannel    
set val(prop)           Propagation/TwoRayGround   
set val(netif)          Phy/WirelessPhy            
set val(mac)            Mac/802\_11                 
set val(ifq)            Queue/DropTail/PriQueue    
set val(ll)             LL                         
set val(ant)            Antenna/OmniAntenna        
set val(ifqlen)         50                         
set val(nn)             6                          
set val(rp)             AODV                       
set val(x)  500   
set val(y)  500   

set ns \[new Simulator\]

set tracefile \[open wireless.tr w\]  
$ns trace-all $tracefile

set namfile \[open wireless.nam w\]  
$ns namtrace-all-wireless $namfile $val(x) $val(y)

set topo \[new Topography\]  
$topo load\_flatgrid $val(x) $val(y)

create-god $val(nn)

set channel1 \[new $val(chan)\]  
set channel2 \[new $val(chan)\]  
set channel3 \[new $val(chan)\]

$ns node-config \-adhocRouting $val(rp) \\  
  \-llType $val(ll) \\  
  \-macType $val(mac) \\  
  \-ifqType $val(ifq) \\  
  \-ifqLen $val(ifqlen) \\  
  \-antType $val(ant) \\  
  \-propType $val(prop) \\  
  \-phyType $val(netif) \\  
  \-topoInstance $topo \\  
  \-agentTrace ON \\  
  \-macTrace ON \\  
  \-routerTrace ON \\  
  \-movementTrace ON \\  
  \-channel $channel1 

set n0 \[$ns node\]  
set n1 \[$ns node\]  
set n2 \[$ns node\]  
set n3 \[$ns node\]  
set n4 \[$ns node\]  
set n5 \[$ns node\]

$n0 random-motion 0  
$n1 random-motion 0  
$n2 random-motion 0  
$n3 random-motion 0  
$n4 random-motion 0  
$n5 random-motion 0

$ns initial\_node\_pos $n0 20  
$ns initial\_node\_pos $n1 20  
$ns initial\_node\_pos $n2 20  
$ns initial\_node\_pos $n3 20  
$ns initial\_node\_pos $n4 20  
$ns initial\_node\_pos $n5 50

$n0 set X\_ 10.0  
$n0 set Y\_ 20.0  
$n0 set Z\_ 0.0

$n1 set X\_ 210.0  
$n1 set Y\_ 230.0  
$n1 set Z\_ 0.0

$n2 set X\_ 100.0  
$n2 set Y\_ 200.0  
$n2 set Z\_ 0.0

$n3 set X\_ 150.0  
$n3 set Y\_ 230.0  
$n3 set Z\_ 0.0

$n4 set X\_ 430.0  
$n4 set Y\_ 320.0  
$n4 set Z\_ 0.0

$n5 set X\_ 270.0  
$n5 set Y\_ 120.0  
$n5 set Z\_ 0.0  

$ns at 1.0 "$n1 setdest 490.0 340.0 25.0"  
$ns at 1.0 "$n4 setdest 300.0 130.0 5.0"  
$ns at 1.0 "$n5 setdest 190.0 440.0 15.0"  
$ns at 20.0 "$n5 setdest 100.0 200.0 30.0"

set tcp \[new Agent/TCP\]  
set sink \[new Agent/TCPSink\]  
$ns attach-agent $n0 $tcp  
$ns attach-agent $n5 $sink  
$ns connect $tcp $sink  
set ftp \[new Application/FTP\]  
$ftp attach-agent $tcp  
$ns at 1.0 "$ftp start"

set udp \[new Agent/UDP\]  
set null \[new Agent/Null\]  
$ns attach-agent $n2 $udp  
$ns attach-agent $n3 $null  
$ns connect $udp $null  
set cbr \[new Application/Traffic/CBR\]  
$cbr attach-agent $udp  
$ns at 1.0 "$cbr start"

$ns at 30.0 "finish"

proc finish {} {  
 global ns tracefile namfile  
 $ns flush-trace  
 close $tracefile  
 close $namfile  
 exit 0  
}

puts "Starting Simulation"  
$ns run

BEGIN {  
    seqno \= \-1;   
    droppedPackets \= 0;  
    receivedPackets \= 0;  
    count \= 0;  
}  
{  
    if($4 \== "AGT" &;& $1 \== "s" && seqno \< $6) {  
        seqno \= $6;  
    } else if(($4 \== "AGT") && ($1 \== "r")) {  
        receivedPackets++;  
    } else if ($1 \== "D" && $7 \== "tcp" && $8 \> 512){  
        droppedPackets++;   
    }

    if($4 \== "AGT" &;& $1 \== "s") {  
        start\_time\[$6\] \= $2;  
    } else if(($7 \== "tcp") && ($1 \== "r")) {  
        end\_time\[$6\] \= $2;  
    } else if($1 \== "D" && $7 \== "tcp") {  
        end\_time\[$6\] \= \-1;  
    }  
}  
    
END {   
    for(i=0; i\<=seqno; i++) {  
        if(end\_time\[i\] \>; 0\) {  
            delay\[i\] \= end\_time\[i\] \- start\_time\[i\];  
        count++;  
        } else {  
            delay\[i\] \= \-1;  
        }  
    }

    for(i=0; i\<count; i++) {  
        if(delay\[i\] \>; 0\) {  
            n\_to\_n\_delay \= n\_to\_n\_delay \+ delay\[i\];  
        }   
    }

    n\_to\_n\_delay \= n\_to\_n\_delay/count;  
    print "\\n";  
    print "GeneratedPackets \= " seqno+1;  
    print "ReceivedPackets \= " receivedPackets;  
    print "Packet Delivery Ratio \= "receivedPackets/(seqno+1)\*100"%";  
    print "Total Dropped Packets \= " droppedPackets;  
    print "Average End-to-End Delay \= " n\_to\_n\_delay \* 1000 " ms";  
    print "\\n";  
}



## DVR

set ns \[new Simulator\]

set tracefile \[open "dv\_routing.tr" w\]  
$ns trace-all $tracefile

set n0 \[$ns node\]  
set n1 \[$ns node\]  
set n2 \[$ns node\]  
set n3 \[$ns node\]  
set n4 \[$ns node\]

$ns duplex-link $n0 $n1 10Mb 10ms DropTail  
$ns duplex-link $n1 $n2 10Mb 10ms DropTail  
$ns duplex-link $n1 $n3 10Mb 15ms DropTail  
$ns duplex-link $n2 $n4 10Mb 20ms DropTail  
$ns duplex-link $n3 $n4 10Mb 25ms DropTail

set ragent \[new Agent/AODV\]

$ns attach-agent $n0 $ragent  
$ns attach-agent $n1 $ragent  
$ns attach-agent $n2 $ragent  
$ns attach-agent $n3 $ragent  
$ns attach-agent $n4 $ragent

set tcp0 \[new Agent/TCP\]  
set sink \[new Agent/TCPSink\]  
$ns attach-agent $n0 $tcp0  
$ns attach-agent $n4 $sink  
$ns connect $tcp0 $sink

set cbr \[new Application/Traffic/CBR\]  
$cbr set packetSize\_ 512  
$cbr set interval\_ 0.5  
$cbr attach-agent $tcp0

$ns at 1.0 "$cbr start"

$ns at 20.0 "finish"

proc finish {} {  
    global ns tracefile  
    $ns flush-trace  
    close $tracefile  
    exit 0  
}

$ns run

BEGIN {  
    route\_updates \= 0;  
    data\_packets \= 0;  
}

$1 \== "s" && $4 \== "AODV" && $7 \== "RT-UPD" {  
    route\_updates++;  
}

$1 \== "s" && $4 \== "tcp" {  
    data\_packets++;  
}

END {  
    printf("Total routing updates: %d\\n", route\_updates);  
    printf("Total data packets sent: %d\\n", data\_packets);  
}



## DHCP

set ns \[new Simulator\]

set tracefile \[open "dhcp\_output.tr" w\]  
$ns trace-all $tracefile

set client1 \[$ns node\]  
set client2 \[$ns node\]  
set dhcpServer \[$ns node\]

$ns duplex-link $client1 $dhcpServer 10Mb 20ms DropTail  
$ns duplex-link $client2 $dhcpServer 10Mb 20ms DropTail

set udpClient1 \[new Agent/UDP\]  
set udpClient2 \[new Agent/UDP\]  
set udpServer \[new Agent/UDP\]

$ns attach-agent $client1 $udpClient1  
$ns attach-agent $client2 $udpClient2  
$ns attach-agent $dhcpServer $udpServer

$ns connect $udpClient1 $udpServer  
$ns connect $udpClient2 $udpServer

set dhcpDiscover1 \[new Application/Traffic/Exponential\]  
$dhcpDiscover1 set packetSize\_ 100   
$dhcpDiscover1 set burst\_time\_ 0.5   
$dhcpDiscover1 set idle\_time\_ 0.1    
$dhcpDiscover1 attach-agent $udpClient1

set dhcpDiscover2 \[new Application/Traffic/Exponential\]  
$dhcpDiscover2 set packetSize\_ 100   
$dhcpDiscover2 set burst\_time\_ 0.5  
$dhcpDiscover2 set idle\_time\_ 0.1  
$dhcpDiscover2 attach-agent $udpClient2

$ns at 1.0 "$dhcpDiscover1 start"  
$ns at 2.0 "$dhcpDiscover2 start"

set dhcpOffer \[new Application/Traffic/Exponential\]  
$dhcpOffer set packetSize\_ 200   
$dhcpOffer attach-agent $udpServer

$ns at 1.5 "$dhcpOffer start"  
$ns at 2.5 "$dhcpOffer start"

proc finish {} {  
    global ns tracefile  
    $ns flush-trace  
    close $tracefile  
    exit 0  
}

$ns at 5.0 "finish"

$ns run

BEGIN {  
    dhcp\_discover\_count \= 0;  
    dhcp\_offer\_count \= 0;  
    total\_delay \= 0;  
}

$1 \== "+" && $4 \== "udp" && $3 \== "client" {  
    dhcp\_discover\_count++;  
    discover\_time\[$3\] \= $2;  
}

$1 \== "r" && $4 \== "udp" && $3 \== "server" {  
    dhcp\_offer\_count++;  
    if ($3 in discover\_time) {  
        total\_delay \+= $2 \- discover\_time\[$3\];  
    }  
}

END {  
    printf("Total DHCP Discover messages: %d\\n", dhcp\_discover\_count);  
    printf("Total DHCP Offer messages: %d\\n", dhcp\_offer\_count);  
    if (dhcp\_offer\_count \> 0\) {  
        printf("Average DHCP response delay: %.5f seconds\\n", total\_delay / dhcp\_offer\_count);  
    }  
}



## LSR

set ns \[new Simulator\]

set tracefile \[open "lsr\_routing.tr" w\]  
$ns trace-all $tracefile

set n0 \[$ns node\]  
set n1 \[$ns node\]  
set n2 \[$ns node\]  
set n3 \[$ns node\]  
set n4 \[$ns node\]

$ns duplex-link $n0 $n1 10Mb 10ms DropTail  
$ns duplex-link $n1 $n2 10Mb 10ms DropTail  
$ns duplex-link $n1 $n3 10Mb 15ms DropTail  
$ns duplex-link $n2 $n4 10Mb 20ms DropTail  
$ns duplex-link $n3 $n4 10Mb 25ms DropTail

$ns node-config \-adhocRouting OLSR

set tcp0 \[new Agent/TCP\]  
set sink \[new Agent/TCPSink\]  
$ns attach-agent $n0 $tcp0  
$ns attach-agent $n4 $sink  
$ns connect $tcp0 $sink

set cbr \[new Application/Traffic/CBR\]  
$cbr set packetSize\_ 512  
$cbr set interval\_ 0.5  
$cbr attach-agent $tcp0

$ns at 1.0 "$cbr start"

$ns at 20.0 "finish"

proc finish {} {  
    global ns tracefile  
    $ns flush-trace  
    close $tracefile  
    exit 0  
}

$ns run

BEGIN {  
    link\_state\_updates \= 0;  
    data\_packets\_sent \= 0;  
    data\_packets\_received \= 0;  
}

$1 \== "s" && $4 \== "OLSR" && $7 \== "LQ-HELLO" {  
    link\_state\_updates++;  
}

$1 \== "s" && $4 \== "tcp" {  
    data\_packets\_sent++;  
}

$1 \== "r" && $4 \== "tcp" {  
    data\_packets\_received++;  
}

END {  
    printf("Total link state updates: %d\\n", link\_state\_updates);  
    printf("Total data packets sent: %d\\n", data\_packets\_sent);  
    printf("Total data packets received: %d\\n", data\_packets\_received);  
}  


## SLIDING

set ns \[new Simulator\]

set tracefile \[open "sliding\_window\_output.tr" w\]  
$ns trace-all $tracefile

set n0 \[$ns node\]  
set n1 \[$ns node\]

$ns duplex-link $n0 $n1 10Mb 20ms DropTail

set tcp \[new Agent/TCP\]  
$tcp set window\_ 5   
$ns attach-agent $n0 $tcp

set sink \[new Agent/TCPSink\]  
$ns attach-agent $n1 $sink

$ns connect $tcp $sink

set cbr \[new Application/Traffic/CBR\]  
$cbr set packetSize\_ 500   
$cbr set rate\_ 1Mb         
$cbr attach-agent $tcp

$ns at 0.5 "$cbr start"  
$ns at 4.5 "$cbr stop"

proc finish {} {  
    global ns tracefile  
    $ns flush-trace  
    close $tracefile  
    exit 0  
}

$ns at 5.0 "finish"

$ns run

BEGIN {  
    sent\_packets \= 0;  
    received\_packets \= 0;  
    dropped\_packets \= 0;  
    total\_delay \= 0;  
    start\_time \= \-1;  
    end\_time \= 0;  
}

$1 \== "+" && $4 \== "tcp" {  
    sent\_packets++;  
}

$1 \== "r" && $4 \== "tcp" {  
    received\_packets++;  
    if (start\_time \== \-1) {  
        start\_time \= $2;  
    }  
    end\_time \= $2;  
}

$1 \== "d" && $4 \== "tcp" {  
    dropped\_packets++;  
}

$1 \== "r" && $4 \== "tcp" {  
    seq\_num \= $11;  
    if (seq\_num in send\_time) {  
        delay \= $2 \- send\_time\[seq\_num\];  
        total\_delay \+= delay;  
    }  
}

$1 \== "+" && $4 \== "tcp" {  
    seq\_num \= $11;  
    send\_time\[seq\_num\] \= $2;  
}

END {  
    simulation\_time \= end\_time \- start\_time;  
    throughput \= (received\_packets \* 500 \* 8\) / simulation\_time;

    packet\_loss\_ratio \= dropped\_packets / sent\_packets;

    if (received\_packets \> 0\) {  
        avg\_delay \= total\_delay / received\_packets;  
    } else {  
        avg\_delay \= 0;  
    }

    printf("Sent Packets: %d\\n", sent\_packets);  
    printf("Received Packets: %d\\n", received\_packets);  
    printf("Dropped Packets: %d\\n", dropped\_packets);  
    printf("Packet Loss Ratio: %.2f%%\\n", packet\_loss\_ratio \* 100);  
    printf("Throughput: %.2f bits/sec\\n", throughput);  
    printf("Average Packet Delay: %.5f seconds\\n", avg\_delay);  
}



## Leaky

set ns \[new Simulator\]

set tf \[open leaky.tr w\]  
set nf \[open leaky.nam w\]  
$ns trace-all $tf  
$ns namtrace-all $nf

set n0 \[$ns node\]  
set n1 \[$ns node\]

$ns duplex-link $n0 $n1 1Mb 10ms DropTail  
$ns queue-limit $n0 $n1 10

set udp \[new Agent/UDP\]  
$ns attach-agent $n0 $udp

set cbr \[new Application/Traffic/CBR\]  
$cbr set packetSize\_ 500  
$cbr set interval\_ 0.004  
$cbr attach-agent $udp

set null \[new Agent/Null\]  
$ns attach-agent $n1 $null  
$ns connect $udp $null

$ns at 0.1 "$cbr start"  
$ns at 4.9 "$cbr stop"  
$ns at 5.0 "finish"

proc finish {} {  
    global ns tf nf  
    $ns flush-trace  
    close $tf  
    close $nf  
    exec nam leaky.nam &  
    exec awk \-f analysis.awk leaky.tr \> leaky\_analysis.txt &  
    exit 0  
}

$ns run



## Token

set ns \[new Simulator\]

set tf \[open token.tr w\]  
set nf \[open token.nam w\]  
$ns trace-all $tf  
$ns namtrace-all $nf

set n0 \[$ns node\]  
set n1 \[$ns node\]

$ns duplex-link $n0 $n1 1Mb 10ms DropTail  
$ns queue-limit $n0 $n1 15

set udp \[new Agent/UDP\]  
$ns attach-agent $n0 $udp

set cbr \[new Application/Traffic/CBR\]  
$cbr set packetSize\_ 500  
$cbr set interval\_ 0.001  
$cbr attach-agent $udp

set null \[new Agent/Null\]  
$ns attach-agent $n1 $null  
$ns connect $udp $null

$ns at 0.1 "$cbr start"  
$ns at 4.9 "$cbr stop"  
$ns at 5.0 "finish"

proc finish {} {  
    global ns tf nf  
    $ns flush-trace  
    close $tf  
    close $nf  
    exec nam token.nam &  
    exec awk \-f analysis.awk token.tr \> token\_analysis.txt &  
    exit 0  
}

$ns run

BEGIN {  
    sent \= 0;  
    received \= 0;  
    dropped \= 0;  
    start\_time \= \-1;  
    end\_time \= 0;  
    total\_bytes \= 0;  
}

{  
    event \= $1;  
    time \= $2;  
    src \= $3;  
    dst \= $4;  
    pkt\_size \= $6;  
    flow\_id \= $8;

    if (start\_time \== \-1 && event \== "+") {  
        start\_time \= time;  
    }

    if (event \== "+" && src \== "0") {  
        sent++;  
    }

    if (event \== "r" && dst \== "1") {  
        received++;  
        total\_bytes \+= pkt\_size;  
        end\_time \= time;  
    }

    if (event \== "d") {  
        dropped++;  
    }  
}

END {  
    print "Simulation Analysis Report";  
    print "--------------------------";  
    print "Total Packets Sent: ", sent;  
    print "Total Packets Received: ", received;  
    print "Total Packets Dropped: ", dropped;  
    print "Packet Delivery Ratio (%): ", (received / sent) \* 100;  
    print "Packet Drop Ratio (%): ", (dropped / sent) \* 100;  
    print "Throughput (Kbps): ", (total\_bytes \* 8\) / (end\_time \- start\_time) / 1000;  
}



## DNS Lookup

set ns \[new Simulator\]

set tracefile \[open dns.tr w\]  
set namfile \[open dns.nam w\]  
$ns trace-all $tracefile  
$ns namtrace-all $namfile

set client \[$ns node\]  
set dns\_server \[$ns node\]

$ns duplex-link $client $dns\_server 1Mb 10ms DropTail

set udpClient \[new Agent/UDP\]  
set udpServer \[new Agent/UDP\]  
$ns attach-agent $client $udpClient  
$ns attach-agent $dns\_server $udpServer

set cbr \[new Application/Traffic/CBR\]  
$cbr set packetSize\_ 50  
$cbr set interval\_ 0.2 
$cbr attach-agent $udpClient

set null \[new Agent/Null\]  
$ns attach-agent $dns\_server $null

$ns connect $udpClient $null

$ns at 0.5 "$cbr start"  
$ns at 4.5 "$cbr stop"  
$ns at 5.0 "finish"

proc finish {} {  
    global ns tracefile namfile  
    $ns flush-trace  
    close $tracefile  
    close $namfile  
    exec nam dns.nam &  
    exit 0  
}

$ns run

BEGIN {  
    query\_count \= 0  
    response\_count \= 0  
    total\_delay \= 0  
    completed \= 0  
}

{  
    if ($1 \== "s" && $7 \== "cbr") {  
        query\_count++  
        send\_time\[$11\] \= $2  
    }

    if ($1 \== "r" && $7 \== "cbr") {  
        if (send\_time\[$11\] \!= "") {  
            delay \= $2 \- send\_time\[$11\]  
            total\_delay \+= delay  
            completed++  
        }  
    }  
}

END {  
    print "DNS Simulation Analysis Report:"  
    print "Total DNS Queries Sent: " query\_count  
    print "Total DNS Responses Received: " completed  
    print "Packet Loss: " (query\_count \- completed)  
    if (completed \> 0\) {  
        print "Average DNS Response Delay: " total\_delay / completed " sec"  
    } else {  
        print "No successful responses to compute delay."  
    }  
}
