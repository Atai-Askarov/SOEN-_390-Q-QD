import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { ClassGraph } from '../constants/ClassGraph';
import { HallXCoordinates } from '../constants/HallXCoordinates';
import { findShortestPath } from './PathFinder';
import { visualizePath } from './PathVisualizer';

const IndoorNavigation = ({ route }) => {
  const [startPoint, setStartPoint] = useState('H831');
  const [endPoint, setEndPoint] = useState('H833');
  const [path, setPath] = useState([]);
  const [allNodes, setAllNodes] = useState([]);
  const webViewRef = useRef(null);
  
  useEffect(() => {
    // Get all available nodes from the graph
    const graph = ClassGraph();
    setAllNodes(Object.keys(graph));
  }, []);
  
  const calculatePath = () => {
    const graph = ClassGraph();
    const shortestPath = findShortestPath(graph, startPoint, endPoint);
    
    if (shortestPath.length === 0) {
      setPath(['No path found']);
    } else {
      setPath(shortestPath);
      
      // Inject the visualizePath function into WebView
      if (webViewRef.current) {
        const coordinates = HallXCoordinates();
        
        // Convert coordinates to a JSON string for injection
        const coordinatesJSON = JSON.stringify(coordinates);
        
        // Create the JavaScript to execute in the WebView
        const js = `
          (function() {
            // Function to visualize the path
            function visualizePath(path, coordinates, svgElement) {
              // Clear any existing paths
              const existingPaths = document.querySelectorAll('.navigation-path');
              existingPaths.forEach(p => p.remove());
              
              // Don't draw anything if path is empty
              if (!path || path.length < 2) return;
              
              // Create SVG path element
              const svgNS = "http://www.w3.org/2000/svg";
              const pathElement = document.createElementNS(svgNS, "path");
              pathElement.classList.add('navigation-path');
              
              // Build the path data string
              let pathData = '';
              
              for (let i = 0; i < path.length; i++) {
                const nodeName = path[i];
                if (!coordinates[nodeName] || !coordinates[nodeName].nearestPoint) {
                  console.error('Missing coordinates for node:', nodeName);
                  continue;
                }
                const point = coordinates[nodeName].nearestPoint;
                
                if (i === 0) {
                  // Move to the first point
                  pathData += \`M \${point.x} \${point.y} \`;
                } else {
                  // Line to subsequent points
                  pathData += \`L \${point.x} \${point.y} \`;
                }
              }
              
              // Set path attributes
              pathElement.setAttribute('d', pathData);
              pathElement.setAttribute('fill', 'none');
              pathElement.setAttribute('stroke', '#3498db');
              pathElement.setAttribute('stroke-width', '5');
              pathElement.setAttribute('stroke-linecap', 'round');
              pathElement.setAttribute('stroke-linejoin', 'round');
              pathElement.setAttribute('stroke-dasharray', '10,5');
              
              // Add animation for dash array
              const animateElement = document.createElementNS(svgNS, "animate");
              animateElement.setAttribute('attributeName', 'stroke-dashoffset');
              animateElement.setAttribute('from', '0');
              animateElement.setAttribute('to', '30');
              animateElement.setAttribute('dur', '1s');
              animateElement.setAttribute('repeatCount', 'indefinite');
              pathElement.appendChild(animateElement);
              
              // Add the path to the SVG
              svgElement.appendChild(pathElement);
              
              console.log('Path visualization completed');
            }
            
            // Get the SVG element
            const svgElement = document.querySelector('svg');
            if (!svgElement) {
              console.error('SVG element not found');
              return;
            }
            
            // Parse the coordinates from JSON
            const coordinates = ${coordinatesJSON};
            
            // The path to visualize
            const path = ${JSON.stringify(shortestPath)};
            
            // Call the visualization function
            visualizePath(path, coordinates, svgElement);
            
            // Return true to indicate successful execution
            return true;
          })();
        `;
        
        webViewRef.current.injectJavaScript(js);
      }
    }
  };

  // HTML content with SVG and pan/zoom functionality
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=2.0, user-scalable=yes">
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            touch-action: manipulation;
          }
          
          #svg-container {
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: relative;
          }
          
          svg {
            width: 100%;
            height: 100%;
            cursor: move;
          }
          
          /* Room styling */
          rect[id]:hover {
            stroke: #0066ff;
            stroke-width: 2px;
            filter: brightness(1.2);
          }
          
          /* Controls */
          .controls {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(255,255,255,0.7);
            border-radius: 5px;
            padding: 5px;
            display: flex;
            gap: 5px;
          }
          
          .controls button {
            width: 30px;
            height: 30px;
            background: #912338;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <div id="svg-container">
          <!-- SVG content -->
          <svg
   width="1024"
   height="1024"
   id="svg2"
   version="1.1"
   inkscape:version="1.4 (86a8ad7, 2024-10-11)"
   sodipodi:docname="Hall-8.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg"
   xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
   xmlns:cc="http://creativecommons.org/ns#"
   xmlns:dc="http://purl.org/dc/elements/1.1/">
  <defs
     id="defs4">
    <linearGradient
       id="linearGradient4705"
       inkscape:swatch="solid">
      <stop
         style="stop-color:#ffffff;stop-opacity:1;"
         offset="0"
         id="stop4707" />
    </linearGradient>
    <filter
       style="color-interpolation-filters:sRGB;"
       inkscape:label="Blur"
       id="filter5156">
      <feGaussianBlur
         stdDeviation="20 20"
         result="blur"
         id="feGaussianBlur5158" />
    </filter>
  </defs>
  <sodipodi:namedview
     id="base"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageopacity="0.0"
     inkscape:pageshadow="2"
     inkscape:zoom="0.7"
     inkscape:cx="623.57143"
     inkscape:cy="523.57143"
     inkscape:document-units="px"
     inkscape:current-layer="g3987"
     showgrid="false"
     inkscape:snap-bbox="false"
     inkscape:bbox-paths="true"
     inkscape:bbox-nodes="true"
     inkscape:object-paths="true"
     inkscape:snap-intersection-paths="true"
     inkscape:object-nodes="true"
     inkscape:snap-nodes="true"
     inkscape:window-width="2400"
     inkscape:window-height="1261"
     inkscape:window-x="-9"
     inkscape:window-y="-9"
     inkscape:window-maximized="1"
     inkscape:showpageshadow="0"
     inkscape:pagecheckerboard="1"
     inkscape:deskcolor="#505050" />
  <metadata
     id="metadata7">
    <rdf:RDF>
      <cc:Work
         rdf:about="">
        <dc:format>image/svg+xml</dc:format>
        <dc:type
           rdf:resource="http://purl.org/dc/dcmitype/StillImage" />
      </cc:Work>
    </rdf:RDF>
  </metadata>
  <g
     inkscape:groupmode="layer"
     id="layer2"
     inkscape:label="Floor Plan"
     transform="translate(0,-28.362168)"
     style="display:inline">
    <g
       id="g3987"
       transform="matrix(1.4703124,0,0,1.4703124,-39.192937,-241.91877)"
       style="stroke:#000000;stroke-width:2.55047846;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:none">
      <rect
         y="220.21931"
         x="33.571445"
         height="625.71429"
         width="682.14288"
         id="rect3007"
         style="fill:#f7d6d6;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="220.21931"
         x="33.571445"
         height="69.821426"
         width="95.178574"
         id="rect3781"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="220.21931"
         x="128.75003"
         height="92.142853"
         width="60.714279"
         id="rect3783"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="220.21931"
         x="189.46432"
         height="92.142853"
         width="66.785721"
         id="rect3785"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="220.21931"
         x="256.25003"
         height="37.321423"
         width="55.714287"
         id="rect3787"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="257.54074"
         x="269.46432"
         height="27.142853"
         width="42.499992"
         id="rect3789"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="284.68362"
         x="269.46432"
         height="27.678572"
         width="42.499992"
         id="rect3791"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         ry="0"
         y="220.21931"
         x="311.96432"
         height="92.142838"
         width="63.92857"
         id="rect3797"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="220.21931"
         x="431.78577"
         height="92.142853"
         width="66.428574"
         id="rect3803"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="220.21931"
         x="498.21429"
         height="92.142853"
         width="55.714294"
         id="H813"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         inkscape:label="H813">
        <title
           id="title6">H813</title>
      </rect>
      <path
         inkscape:connector-curvature="0"
         id="path3809"
         d="m 621.4286,220.21936 v 71.42857 h -18.92857 v 20.71428 h -48.57141 v -92.14285 z"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="220.21931"
         x="621.42859"
         height="91.785706"
         width="94.285744"
         id="H817"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         inkscape:label="H817">
        <title
           id="title5">H817</title>
      </rect>
      <rect
         y="312.00504"
         x="621.42859"
         height="66.071434"
         width="94.285721"
         id="rect3813"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="378.07651"
         x="621.42859"
         height="57.499996"
         width="94.285721"
         id="rect3815"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="435.57651"
         x="621.42859"
         height="66.071426"
         width="94.285721"
         id="rect3817"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="501.64792"
         x="621.42859"
         height="57.499992"
         width="94.285721"
         id="rect3819"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="559.14789"
         x="621.42859"
         height="65.000015"
         width="94.285721"
         id="rect3821"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="624.14789"
         x="621.42859"
         height="63.214279"
         width="94.285721"
         id="rect3823"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="748.43359"
         x="621.07141"
         height="97.500015"
         width="94.642883"
         id="H831"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         inkscape:label="H831">
        <title
           id="title1">H831</title>
      </rect>
      <rect
         y="748.43359"
         x="559.28571"
         height="97.500031"
         width="61.785694"
         id="H833"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         inkscape:label="H833">
        <title
           id="title2">H833</title>
      </rect>
      <rect
         y="748.43359"
         x="496.42859"
         height="97.500031"
         width="62.857132"
         id="H835"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         inkscape:label="H835">
        <title
           id="title3">H835</title>
      </rect>
      <rect
         y="748.43359"
         x="433.21436"
         height="97.500031"
         width="63.214272"
         id="H837"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         inkscape:label="H837">
        <title
           id="title4">H837</title>
      </rect>
      <rect
         y="748.07648"
         x="315.71432"
         height="97.857155"
         width="59.285713"
         id="rect3833"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="748.07648"
         x="248.57147"
         height="97.857147"
         width="67.142868"
         id="rect3835"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="748.07648"
         x="192.14285"
         height="97.857147"
         width="56.42857"
         id="rect3837"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="748.07648"
         x="124.64286"
         height="97.857147"
         width="67.499992"
         id="rect3839"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="748.07648"
         x="33.571445"
         height="97.857147"
         width="91.071426"
         id="rect3841"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="716.29077"
         x="33.571445"
         height="31.785723"
         width="50.35714"
         id="rect3843"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="684.50507"
         x="33.571445"
         height="31.785732"
         width="64.285713"
         id="rect3845"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="684.50507"
         x="97.857155"
         height="40.357117"
         width="31.071428"
         id="rect3847"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="622.36218"
         x="33.571445"
         height="62.142883"
         width="95.357147"
         id="rect3849"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="559.50507"
         x="33.571445"
         height="62.857143"
         width="95.357147"
         id="rect3851"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="499.5051"
         x="33.571445"
         height="60.000027"
         width="95.357147"
         id="rect3853"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="437.0051"
         x="33.571445"
         height="62.499996"
         width="95.357147"
         id="rect3855"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="375.57651"
         x="33.571445"
         height="61.42857"
         width="95.357147"
         id="rect3857"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="290.0408"
         x="33.571445"
         height="24.10714"
         width="77.85714"
         id="rect3859"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path3861"
         d="M 128.92861,375.57651 V 328.43364 H 111.4286 v -14.2857 H 33.571462 v 61.42857 z"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path3863"
         d="m 640.71432,748.43362 v -17.49998 h -18.57143 l -0.71427,-43.57144 h 94.28572 l -2e-5,61.07142 z"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="349.86221"
         x="165.71432"
         height="90.35714"
         width="62.142857"
         id="rect3865"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="349.86221"
         x="227.85715"
         height="61.785713"
         width="111.42858"
         id="rect3873"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="349.86221"
         x="280.35718"
         height="34.285713"
         width="34.285713"
         id="rect3875"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="411.64792"
         x="227.85715"
         height="28.571426"
         width="21.785721"
         id="rect3877"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="411.64792"
         x="249.64288"
         height="23.571428"
         width="22.500006"
         id="rect3881"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="411.64792"
         x="272.14288"
         height="23.571421"
         width="20"
         id="rect3883"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="411.64792"
         x="339.28574"
         height="27.5"
         width="36.428574"
         id="rect3885"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="387.00504"
         x="339.28574"
         height="24.642849"
         width="36.428566"
         id="rect3887"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="360.57651"
         x="339.28574"
         height="26.428568"
         width="36.428558"
         id="rect3889"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="411.64792"
         x="292.14288"
         height="27.499992"
         width="47.142853"
         id="rect3891"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="474.14792"
         x="313.92859"
         height="195.71428"
         width="25"
         id="rect3895"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="639.86218"
         x="338.92859"
         height="29.999985"
         width="37.857155"
         id="rect3897"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="474.14792"
         x="250.71432"
         height="88.214294"
         width="63.214272"
         id="rect3899"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="474.14792"
         x="216.78574"
         height="57.142864"
         width="33.928566"
         id="rect3901"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="531.29077"
         x="216.78574"
         height="31.07143"
         width="33.928558"
         id="rect3903"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="503.43369"
         x="171.78574"
         height="27.857143"
         width="34.285713"
         id="rect3908"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="474.14792"
         x="171.78574"
         height="29.285812"
         width="34.28574"
         id="rect3913"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         sodipodi:nodetypes="ccccccc"
         inkscape:connector-curvature="0"
         id="path3917"
         d="M 216.78575,562.54079 V 543.0765 H 206.4286 l -0.35714,-11.7857 h -34.28571 v 31.24999 z"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="643.07648"
         x="215.71432"
         height="65.714287"
         width="36.07143"
         id="rect3919"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="643.07642"
         x="171.78574"
         height="65.714371"
         width="43.928551"
         id="rect3923"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         sodipodi:nodetypes="ccccccc"
         inkscape:connector-curvature="0"
         id="path3925"
         d="m 171.78575,562.54079 v 57.67856 h 52.85714 v -7.14285 h 26.24999 v -50.71429 z"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path3927"
         d="m 250.89288,562.36221 v 69.64286 h 17.67858 v 10.53571 h 45.35713 l -10e-6,-80.17857 z"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="620.2193"
         x="171.78574"
         height="22.857094"
         width="52.85717"
         id="rect3931"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="684.41412"
         x="251.78574"
         height="24.376646"
         width="41.663605"
         id="rect3933"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         sodipodi:nodetypes="ccccccc"
         inkscape:connector-curvature="0"
         id="path3935"
         d="m 313.92859,669.8622 v 26.1687 h 38.36214 v 12.12183 h 24.74874 l -0.25373,-38.29053 z"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path3937"
         d="m 293.44934,684.41415 v -41.87337 h -24.87788 v 16.87209 h -16.78572 v 25.00128 z"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="350.30618"
         x="431.84027"
         height="89.398499"
         width="64.649765"
         id="rect3941"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="350.30618"
         x="443.57153"
         height="12.770314"
         width="11.785714"
         id="rect3943"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="350.30618"
         x="496.48999"
         height="89.398483"
         width="36.01004"
         id="rect3945"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="350.30618"
         x="532.5"
         height="70.091736"
         width="48.035873"
         id="rect3947"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="420.39792"
         x="532.5"
         height="19.306747"
         width="48.035843"
         id="rect3949"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="478.43369"
         x="541.07141"
         height="40.714287"
         width="39.107143"
         id="rect3951"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         d="m 431.84223,439.70229 v 118.02339 h 121.97663 v -38.57599 h -12.7524 v -40.72263 h 12.7524 v -38.72477 z"
         id="rect4731"
         inkscape:connector-curvature="0" />
      <rect
         y="557.7193"
         x="498.21429"
         height="85.714287"
         width="83.571426"
         id="rect3955"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="643.43359"
         x="498.21429"
         height="65.178596"
         width="36.428562"
         id="rect3957"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="643.43359"
         x="534.64288"
         height="65.178604"
         width="47.142864"
         id="rect3959"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="643.43359"
         x="470.00006"
         height="65.178596"
         width="28.214294"
         id="rect3961"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         sodipodi:nodetypes="cc"
         inkscape:connector-curvature="0"
         id="path3963"
         d="M 431.84024,439.70468 V 622.54233"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="622.5423"
         x="431.84027"
         height="43.184021"
         width="25.00128"
         id="rect3965"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="665.72632"
         x="431.84027"
         height="21.993006"
         width="25.00128"
         id="rect3969"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <rect
         y="687.7193"
         x="431.84027"
         height="20.892859"
         width="25.00128"
         id="rect3971"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path3973"
         d="M 470.00003,643.43362 H 456.84152"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path3975"
         d="M 498.21432,557.71933 H 431.84024"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path3981"
         d="m 541.07144,519.14794 -22.86315,38.57139"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         inkscape:connector-curvature="0"
         id="path3983"
         d="M 541.07144,478.43365 517.70321,439.70467"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         sodipodi:nodetypes="cc"
         inkscape:connector-curvature="0"
         id="path3985"
         d="M 375.71431,473.43363 V 601.3291"
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1" />
      <path
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         d="m 224.63711,613.07106 v 18.9373 11.07333 h 26.24867 0.89267 v 16.32306 h 16.79065 v -27.39639 h -17.68332 v -18.9373 z"
         id="rect4717"
         inkscape:connector-curvature="0" />
      <path
         style="fill:#da3636;fill-opacity:1;stroke:#000000;stroke-width:1.36026;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         d="m 431.84223,557.72568 v 64.82466 h 24.99468 v 20.89267 h 41.38152 v -20.89267 -64.82466 z"
         id="rect4726"
         inkscape:connector-curvature="0" />
    </g>
  </g>
</svg>
          
          <!-- Add controls for panning and zooming -->
          <div class="controls">
            <button id="zoom-in">+</button>
            <button id="zoom-out">-</button>
            <button id="reset">⟲</button>
          </div>
        </div>
        
        <script>
          // Pan and zoom functionality
          (function() {
            const svgElement = document.querySelector('svg');
            const container = document.getElementById('svg-container');
            
            let currentScale = 1;
            let viewBox = {x: 0, y: 0, width: 1024, height: 1024};
            let isPanning = false;
            let startPoint = {x: 0, y: 0};
            let endPoint = {x: 0, y: 0};
            
            // Initialize viewBox
            function updateViewBox() {
              svgElement.setAttribute('viewBox', 
                \`\${viewBox.x} \${viewBox.y} \${viewBox.width} \${viewBox.height}\`);
            }
            
            // Zoom controls
            document.getElementById('zoom-in').addEventListener('click', () => {
              currentScale = Math.min(currentScale * 1.2, 3);
              viewBox.width = 1024 / currentScale;
              viewBox.height = 1024 / currentScale;
              
              // Adjust viewBox position to zoom towards center
              const centerX = viewBox.x + (1024 / currentScale / 2);
              const centerY = viewBox.y + (1024 / currentScale / 2);
              viewBox.x = centerX - (viewBox.width / 2);
              viewBox.y = centerY - (viewBox.height / 2);
              
              updateViewBox();
            });
            
            document.getElementById('zoom-out').addEventListener('click', () => {
              currentScale = Math.max(currentScale / 1.2, 0.5);
              viewBox.width = 1024 / currentScale;
              viewBox.height = 1024 / currentScale;
              
              // Adjust viewBox position to zoom from center
              const centerX = viewBox.x + (1024 / currentScale / 2);
              const centerY = viewBox.y + (1024 / currentScale / 2);
              viewBox.x = centerX - (viewBox.width / 2);
              viewBox.y = centerY - (viewBox.height / 2);
              
              updateViewBox();
            });
            
            document.getElementById('reset').addEventListener('click', () => {
              currentScale = 1;
              viewBox = {x: 0, y: 0, width: 1024, height: 1024};
              updateViewBox();
            });
            
            // Pan handlers
            container.addEventListener('mousedown', startPan);
            container.addEventListener('touchstart', startPan);
            
            function startPan(e) {
              isPanning = true;
              
              if (e.type === 'touchstart') {
                startPoint.x = e.touches[0].clientX;
                startPoint.y = e.touches[0].clientY;
              } else {
                startPoint.x = e.clientX;
                startPoint.y = e.clientY;
              }
            }
            
            container.addEventListener('mousemove', movePan);
            container.addEventListener('touchmove', movePan);
            
            function movePan(e) {
              if (!isPanning) return;
              
              e.preventDefault();
              
              if (e.type === 'touchmove') {
                endPoint.x = e.touches[0].clientX;
                endPoint.y = e.touches[0].clientY;
              } else {
                endPoint.x = e.clientX;
                endPoint.y = e.clientY;
              }
              
              const dx = (startPoint.x - endPoint.x) * (viewBox.width / container.clientWidth);
              const dy = (startPoint.y - endPoint.y) * (viewBox.height / container.clientHeight);
              
              viewBox.x += dx;
              viewBox.y += dy;
              
              startPoint.x = endPoint.x;
              startPoint.y = endPoint.y;
              
              updateViewBox();
            }
            
            container.addEventListener('mouseup', endPan);
            container.addEventListener('mouseleave', endPan);
            container.addEventListener('touchend', endPan);
            container.addEventListener('touchcancel', endPan);
            
            function endPan() {
              isPanning = false;
            }
            
            // Initial setup
            updateViewBox();
          })();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Indoor Navigation - H Building 8th Floor</Text>
      
      {/* SVG Floor Plan in WebView */}
      <View style={styles.webViewContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: htmlContent }}
          style={styles.webView}
          originWhitelist={['*']}
          javaScriptEnabled={true}
        />
      </View>
      
      <View style={styles.selectorsContainer}>
        <View style={styles.selectorWrapper}>
          <Text style={styles.label}>Start:</Text>
          <ScrollView style={styles.selector}>
            {allNodes.map(node => (
              <TouchableOpacity 
                key={node} 
                style={[styles.option, startPoint === node && styles.selectedOption]}
                onPress={() => setStartPoint(node)}
              >
                <Text style={styles.optionText}>{node}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        
        <View style={styles.selectorWrapper}>
          <Text style={styles.label}>End:</Text>
          <ScrollView style={styles.selector}>
            {allNodes.map(node => (
              <TouchableOpacity 
                key={node} 
                style={[styles.option, endPoint === node && styles.selectedOption]}
                onPress={() => setEndPoint(node)}
              >
                <Text style={styles.optionText}>{node}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      
      <TouchableOpacity style={styles.button} onPress={calculatePath}>
        <Text style={styles.buttonText}>Find Path</Text>
      </TouchableOpacity>
      
      <View style={styles.resultContainer}>
        <Text style={styles.resultTitle}>Navigation Path:</Text>
        {path.length > 0 ? (
          <View style={styles.pathContainer}>
            {path.map((node, index) => (
              <View key={index} style={styles.pathStep}>
                <Text style={styles.stepText}>{index + 1}. {node}</Text>
                {index < path.length - 1 && (
                  <Text style={styles.arrow}>↓</Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <Text style={styles.noPath}>Press "Find Path" to calculate the route</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#912338',
  },
  selectorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  selectorWrapper: {
    flex: 1,
    marginHorizontal: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  selector: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  option: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#ffe6e6',
  },
  optionText: {
    fontSize: 14,
  },
  button: {
    backgroundColor: '#912338',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginVertical: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 16,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pathContainer: {
    paddingHorizontal: 16,
  },
  pathStep: {
    marginVertical: 4,
  },
  stepText: {
    fontSize: 16,
  },
  arrow: {
    textAlign: 'center',
    fontSize: 18,
    color: '#912338',
  },
  noPath: {
    fontStyle: 'italic',
    color: '#666',
  },
  webViewContainer: {
    height: 300,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden'
  },
  webView: {
    flex: 1
  }
});

export default IndoorNavigation; 