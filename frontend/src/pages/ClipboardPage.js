import React, { useState, useRef, useEffect } from 'react';
import { FaCopy, FaCheck, FaChevronDown, FaChevronRight, FaEye, FaEyeSlash } from 'react-icons/fa';
import '../components/Clipboard/Clipboard.css';

const ClipboardPage = () => {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedCodes, setExpandedCodes] = useState({});
  const [stealthMode, setStealthMode] = useState(true);
  const [showStealthIndicator, setShowStealthIndicator] = useState(false);
  const textAreaRef = useRef(null);

  // Handle keyboard shortcuts for stealth mode
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle stealth mode with Ctrl+Shift+S
      if (e.ctrlKey && e.shiftKey && e.key === 'S') {
        setStealthMode(prev => !prev);
        setShowStealthIndicator(true);
        setTimeout(() => setShowStealthIndicator(false), 2000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const copyToClipboard = (text, index) => {
    // Create a temporary textarea element to copy from
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed'; // Prevent scrolling to bottom
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    try {
      // Try the modern clipboard API first
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopiedIndex(index);
          setTimeout(() => setCopiedIndex(null), 2000);
        })
        .catch(() => {
          // Fallback to document.execCommand
          const successful = document.execCommand('copy');
          if (successful) {
            setCopiedIndex(index);
            setTimeout(() => setCopiedIndex(null), 2000);
          } else {
            console.error('Failed to copy text');
          }
        });
    } catch (err) {
      // Final fallback
      try {
        const successful = document.execCommand('copy');
        if (successful) {
          setCopiedIndex(index);
          setTimeout(() => setCopiedIndex(null), 2000);
        } else {
          console.error('Failed to copy text');
        }
      } catch (err) {
        console.error('Failed to copy text', err);
      }
    } finally {
      // Clean up
      document.body.removeChild(textarea);
    }
  };

  const toggleCodeExpansion = (index) => {
    setExpandedCodes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const notebookData = [
    {
      type: 'markdown',
      content: '## Wired Network Simulation'
    },
    {
      type: 'code',
      content: `set ns [new Simulator]

set tracefile [open out.tr w]  
$ns trace-all $tracefile

set namfile [open out.nam w]  
$ns namtrace-all $namfile

set n0 [$ns node]  
set n1 [$ns node]  
set n2 [$ns node]

$ns duplex-link $n0 $n1 1Mb 10ms DropTail  
$ns duplex-link $n1 $n2 1Mb 10ms DropTail

$ns queue-limit $n0 $n1 10  
$ns queue-limit $n1 $n2 10

set tcp [new Agent/TCP]  
$ns attach-agent $n0 $tcp  
set sink [new Agent/TCPSink]  
$ns attach-agent $n2 $sink  
$ns connect $tcp $sink

set ftp [new Application/FTP]  
$ftp attach-agent $tcp  
$ftp set type_ FTP

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

$ns run`
    },
    {
      type: 'markdown',
      content: '## Wireless Network Simulation'
    },
    {
      type: 'code',
      content: `set val(chan)           Channel/WirelessChannel    
set val(prop)           Propagation/TwoRayGround   
set val(netif)          Phy/WirelessPhy            
set val(mac)            Mac/802_11                 
set val(ifq)            Queue/DropTail/PriQueue    
set val(ll)             LL                         
set val(ant)            Antenna/OmniAntenna        
set val(ifqlen)         50                         
set val(nn)             6                          
set val(rp)             AODV                       
set val(x)  500   
set val(y)  500   

set ns [new Simulator]

set tracefile [open wireless.tr w]  
$ns trace-all $tracefile

set namfile [open wireless.nam w]  
$ns namtrace-all-wireless $namfile $val(x) $val(y)

set topo [new Topography]  
$topo load_flatgrid $val(x) $val(y)

create-god $val(nn)

set channel1 [new $val(chan)]  
set channel2 [new $val(chan)]  
set channel3 [new $val(chan)]

$ns node-config -adhocRouting $val(rp) \\  
  -llType $val(ll) \\  
  -macType $val(mac) \\  
  -ifqType $val(ifq) \\  
  -ifqLen $val(ifqlen) \\  
  -antType $val(ant) \\  
  -propType $val(prop) \\  
  -phyType $val(netif) \\  
  -topoInstance $topo \\  
  -agentTrace ON \\  
  -macTrace ON \\  
  -routerTrace ON \\  
  -movementTrace ON \\  
  -channel $channel1 

set n0 [$ns node]  
set n1 [$ns node]  
set n2 [$ns node]  
set n3 [$ns node]  
set n4 [$ns node]  
set n5 [$ns node]

$n0 random-motion 0  
$n1 random-motion 0  
$n2 random-motion 0  
$n3 random-motion 0  
$n4 random-motion 0  
$n5 random-motion 0

$ns initial_node_pos $n0 20  
$ns initial_node_pos $n1 20  
$ns initial_node_pos $n2 20  
$ns initial_node_pos $n3 20  
$ns initial_node_pos $n4 20  
$ns initial_node_pos $n5 50

$n0 set X_ 10.0  
$n0 set Y_ 20.0  
$n0 set Z_ 0.0

$n1 set X_ 210.0  
$n1 set Y_ 230.0  
$n1 set Z_ 0.0

$n2 set X_ 100.0  
$n2 set Y_ 200.0  
$n2 set Z_ 0.0

$n3 set X_ 150.0  
$n3 set Y_ 230.0  
$n3 set Z_ 0.0

$n4 set X_ 430.0  
$n4 set Y_ 320.0  
$n4 set Z_ 0.0

$n5 set X_ 270.0  
$n5 set Y_ 120.0  
$n5 set Z_ 0.0  

$ns at 1.0 "$n1 setdest 490.0 340.0 25.0"  
$ns at 1.0 "$n4 setdest 300.0 130.0 5.0"  
$ns at 1.0 "$n5 setdest 190.0 440.0 15.0"  
$ns at 20.0 "$n5 setdest 100.0 200.0 30.0"

set tcp [new Agent/TCP]  
set sink [new Agent/TCPSink]  
$ns attach-agent $n0 $tcp  
$ns attach-agent $n5 $sink  
$ns connect $tcp $sink  
set ftp [new Application/FTP]  
$ftp attach-agent $tcp  
$ns at 1.0 "$ftp start"

set udp [new Agent/UDP]  
set null [new Agent/Null]  
$ns attach-agent $n2 $udp  
$ns attach-agent $n3 $null  
$ns connect $udp $null  
set cbr [new Application/Traffic/CBR]  
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
$ns run`
    },
    {
      type: 'markdown',
      content: '## Distance Vector Routing'
    },
    {
      type: 'code',
      content: `set ns [new Simulator]

set tracefile [open "dv_routing.tr" w]  
$ns trace-all $tracefile

set n0 [$ns node]  
set n1 [$ns node]  
set n2 [$ns node]  
set n3 [$ns node]  
set n4 [$ns node]

$ns duplex-link $n0 $n1 10Mb 10ms DropTail  
$ns duplex-link $n1 $n2 10Mb 10ms DropTail  
$ns duplex-link $n1 $n3 10Mb 15ms DropTail  
$ns duplex-link $n2 $n4 10Mb 20ms DropTail  
$ns duplex-link $n3 $n4 10Mb 25ms DropTail

set ragent [new Agent/AODV]

$ns attach-agent $n0 $ragent  
$ns attach-agent $n1 $ragent  
$ns attach-agent $n2 $ragent  
$ns attach-agent $n3 $ragent  
$ns attach-agent $n4 $ragent

set tcp0 [new Agent/TCP]  
set sink [new Agent/TCPSink]  
$ns attach-agent $n0 $tcp0  
$ns attach-agent $n4 $sink  
$ns connect $tcp0 $sink

set cbr [new Application/Traffic/CBR]  
$cbr set packetSize_ 512  
$cbr set interval_ 0.5  
$cbr attach-agent $tcp0

$ns at 1.0 "$cbr start"

$ns at 20.0 "finish"

proc finish {} {  
    global ns tracefile  
    $ns flush-trace  
    close $tracefile  
    exit 0  
}

$ns run`
    },
    {
      type: 'markdown',
      content: '## DHCP Simulation'
    },
    {
      type: 'code',
      content: `set ns [new Simulator]

set tracefile [open "dhcp_output.tr" w]  
$ns trace-all $tracefile

set client1 [$ns node]  
set client2 [$ns node]  
set dhcpServer [$ns node]

$ns duplex-link $client1 $dhcpServer 10Mb 20ms DropTail  
$ns duplex-link $client2 $dhcpServer 10Mb 20ms DropTail

set udpClient1 [new Agent/UDP]  
set udpClient2 [new Agent/UDP]  
set udpServer [new Agent/UDP]

$ns attach-agent $client1 $udpClient1  
$ns attach-agent $client2 $udpClient2  
$ns attach-agent $dhcpServer $udpServer

$ns connect $udpClient1 $udpServer  
$ns connect $udpClient2 $udpServer

set dhcpDiscover1 [new Application/Traffic/Exponential]  
$dhcpDiscover1 set packetSize_ 100   
$dhcpDiscover1 set burst_time_ 0.5   
$dhcpDiscover1 set idle_time_ 0.1    
$dhcpDiscover1 attach-agent $udpClient1

set dhcpDiscover2 [new Application/Traffic/Exponential]  
$dhcpDiscover2 set packetSize_ 100   
$dhcpDiscover2 set burst_time_ 0.5  
$dhcpDiscover2 set idle_time_ 0.1  
$dhcpDiscover2 attach-agent $udpClient2

$ns at 1.0 "$dhcpDiscover1 start"  
$ns at 2.0 "$dhcpDiscover2 start"

set dhcpOffer [new Application/Traffic/Exponential]  
$dhcpOffer set packetSize_ 200   
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

$ns run`
    },
    {
      type: 'markdown',
      content: '## Link State Routing'
    },
    {
      type: 'code',
      content: `set ns [new Simulator]

set tracefile [open "lsr_routing.tr" w]  
$ns trace-all $tracefile

set n0 [$ns node]  
set n1 [$ns node]  
set n2 [$ns node]  
set n3 [$ns node]  
set n4 [$ns node]

$ns duplex-link $n0 $n1 10Mb 10ms DropTail  
$ns duplex-link $n1 $n2 10Mb 10ms DropTail  
$ns duplex-link $n1 $n3 10Mb 15ms DropTail  
$ns duplex-link $n2 $n4 10Mb 20ms DropTail  
$ns duplex-link $n3 $n4 10Mb 25ms DropTail

$ns node-config -adhocRouting OLSR

set tcp0 [new Agent/TCP]  
set sink [new Agent/TCPSink]  
$ns attach-agent $n0 $tcp0  
$ns attach-agent $n4 $sink  
$ns connect $tcp0 $sink

set cbr [new Application/Traffic/CBR]  
$cbr set packetSize_ 512  
$cbr set interval_ 0.5  
$cbr attach-agent $tcp0

$ns at 1.0 "$cbr start"

$ns at 20.0 "finish"

proc finish {} {  
    global ns tracefile  
    $ns flush-trace  
    close $tracefile  
    exit 0  
}

$ns run`
    },
    {
      type: 'markdown',
      content: '## Sliding Window Protocol'
    },
    {
      type: 'code',
      content: `set ns [new Simulator]

set tracefile [open "sliding_window_output.tr" w]  
$ns trace-all $tracefile

set n0 [$ns node]  
set n1 [$ns node]

$ns duplex-link $n0 $n1 10Mb 20ms DropTail

set tcp [new Agent/TCP]  
$tcp set window_ 5   
$ns attach-agent $n0 $tcp

set sink [new Agent/TCPSink]  
$ns attach-agent $n1 $sink

$ns connect $tcp $sink

set cbr [new Application/Traffic/CBR]  
$cbr set packetSize_ 500   
$cbr set rate_ 1Mb         
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

$ns run`
    },
    {
      type: 'markdown',
      content: '## Leaky Bucket Algorithm'
    },
    {
      type: 'code',
      content: `set ns [new Simulator]

set tf [open leaky.tr w]  
set nf [open leaky.nam w]  
$ns trace-all $tf  
$ns namtrace-all $nf

set n0 [$ns node]  
set n1 [$ns node]

$ns duplex-link $n0 $n1 1Mb 10ms DropTail  
$ns queue-limit $n0 $n1 10

set udp [new Agent/UDP]  
$ns attach-agent $n0 $udp

set cbr [new Application/Traffic/CBR]  
$cbr set packetSize_ 500  
$cbr set interval_ 0.004  
$cbr attach-agent $udp

set null [new Agent/Null]  
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
    exec awk -f analysis.awk leaky.tr > leaky_analysis.txt &  
    exit 0  
}

$ns run`
    },
    {
      type: 'markdown',
      content: '## Token Bucket Algorithm'
    },
    {
      type: 'code',
      content: `set ns [new Simulator]

set tf [open token.tr w]  
set nf [open token.nam w]  
$ns trace-all $tf  
$ns namtrace-all $nf

set n0 [$ns node]  
set n1 [$ns node]

$ns duplex-link $n0 $n1 1Mb 10ms DropTail  
$ns queue-limit $n0 $n1 15

set udp [new Agent/UDP]  
$ns attach-agent $n0 $udp

set cbr [new Application/Traffic/CBR]  
$cbr set packetSize_ 500  
$cbr set interval_ 0.001  
$cbr attach-agent $udp

set null [new Agent/Null]  
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
    exec awk -f analysis.awk token.tr > token_analysis.txt &  
    exit 0  
}

$ns run`
    },
    {
      type: 'markdown',
      content: '## DNS Lookup Simulation'
    },
    {
      type: 'code',
      content: `set ns [new Simulator]

set tracefile [open dns.tr w]  
set namfile [open dns.nam w]  
$ns trace-all $tracefile  
$ns namtrace-all $namfile

set client [$ns node]  
set dns_server [$ns node]

$ns duplex-link $client $dns_server 1Mb 10ms DropTail

set udpClient [new Agent/UDP]  
set udpServer [new Agent/UDP]  
$ns attach-agent $client $udpClient  
$ns attach-agent $dns_server $udpServer

set cbr [new Application/Traffic/CBR]  
$cbr set packetSize_ 50  
$cbr set interval_ 0.2 
$cbr attach-agent $udpClient

set null [new Agent/Null]  
$ns attach-agent $dns_server $null

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

$ns run`
    }
  ];

  return (
    <div className={`clipboard-page ${stealthMode ? 'stealth-mode' : ''}`}>
      {showStealthIndicator && (
        <div className="stealth-indicator">
          {stealthMode ? 'Stealth Mode: ON' : 'Stealth Mode: OFF'}
        </div>
      )}
      <div className="clipboard-container">
        <div className="clipboard-header">
          <h1>Code Clipboard</h1>
          <div className="stealth-toggle" onClick={() => {
            setStealthMode(prev => !prev);
            setShowStealthIndicator(true);
            setTimeout(() => setShowStealthIndicator(false), 2000);
          }}>
            {stealthMode ? <FaEyeSlash /> : <FaEye />}
          </div>
        </div>
        <div className="notebook">
          {notebookData.map((cell, index) => (
            <div key={index} className={`cell ${cell.type}-cell`}>
              {cell.type === 'markdown' ? (
                <div className="markdown-content">
                  {cell.content}
                </div>
              ) : (
                <div className="code-cell">
                  <div className="code-header">
                    <div className="code-title" onClick={() => toggleCodeExpansion(index)}>
                      {expandedCodes[index] ? <FaChevronDown /> : <FaChevronRight />}
                      <span>Python</span>
                    </div>
                    <button 
                      className={`copy-button ${copiedIndex === index ? 'copied' : ''}`}
                      onClick={() => copyToClipboard(cell.content, index)}
                    >
                      {copiedIndex === index ? (
                        <>
                          <FaCheck /> Copied
                        </>
                      ) : (
                        <>
                          <FaCopy /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  {expandedCodes[index] && (
                    <pre className="code-content">
                      <code>{cell.content}</code>
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ClipboardPage; 