/*
 * This file is part of the TYPO3 CMS project.
 *
 * It is free software; you can redistribute it and/or modify it under
 * the terms of the GNU General Public License, either version 2
 * of the License, or any later version.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * The TYPO3 project - inspiring people to share!
 */
var __importDefault=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};define(["require","exports","./DragDrop","../Modal","../Severity","../Notification","TYPO3/CMS/Core/Ajax/AjaxRequest"],(function(e,t,s,r,i,n,o){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.FileStorageTreeNodeDragHandler=t.FileStorageTreeActions=void 0,o=__importDefault(o);class a extends s.DragDrop{changeNodePosition(e){const t=this.tree.nodes,r=this.tree.settings.nodeDrag.identifier;let i=this.tree.settings.nodeDragPosition,n=e||this.tree.settings.nodeDrag;if(r===n.identifier)return null;if(i===s.DraggablePositionEnum.BEFORE){const s=t.indexOf(e),r=this.setNodePositionAndTarget(s);if(null===r)return null;i=r.position,n=r.target}return{node:this.tree.settings.nodeDrag,identifier:r,target:n,position:i}}setNodePositionAndTarget(e){const t=this.tree.nodes,r=t[e].depth;e>0&&e--;const i=t[e].depth,n=this.tree.nodes[e];if(i===r)return{position:s.DraggablePositionEnum.AFTER,target:n};if(i<r)return{position:s.DraggablePositionEnum.INSIDE,target:n};for(let i=e;i>=0;i--){if(t[i].depth===r)return{position:s.DraggablePositionEnum.AFTER,target:this.tree.nodes[i]};if(t[i].depth<r)return{position:s.DraggablePositionEnum.AFTER,target:t[i]}}return null}changeNodeClasses(e){const t=this.tree.svg.select(".node-over"),r=this.tree.svg.node().parentNode.querySelector(".node-dd");t.size()&&this.tree.isOverSvg&&(this.tree.nodesBgContainer.selectAll(".node-bg__border").style("display","none"),this.addNodeDdClass(r,"ok-append"),this.tree.settings.nodeDragPosition=s.DraggablePositionEnum.INSIDE)}}t.FileStorageTreeActions=a;t.FileStorageTreeNodeDragHandler=class{constructor(e,t){this.startDrag=!1,this.startPageX=0,this.startPageY=0,this.isDragged=!1,this.tree=e,this.actionHandler=t}dragStart(e){return 0!==e.subject.depth&&(this.startPageX=e.sourceEvent.pageX,this.startPageY=e.sourceEvent.pageY,this.startDrag=!1,!0)}dragDragged(e){let t=e.subject;if(!this.actionHandler.isDragNodeDistanceMore(e,this))return!1;if(this.startDrag=!0,0===t.depth)return!1;this.tree.settings.nodeDrag=t;let s=this.tree.svg.node().querySelector('.node-bg[data-state-id="'+t.stateIdentifier+'"]'),r=this.tree.svg.node().parentNode.querySelector(".node-dd");return this.isDragged||(this.isDragged=!0,this.actionHandler.createDraggable(this.tree.getIconId(t),t.name),null==s||s.classList.add("node-bg--dragging")),this.tree.settings.nodeDragPosition=!1,this.actionHandler.openNodeTimeout(),this.actionHandler.updateDraggablePosition(e),(t.isOver||this.tree.hoveredNode&&-1!==this.tree.hoveredNode.parentsStateIdentifier.indexOf(t.stateIdentifier)||!this.tree.isOverSvg)&&(this.actionHandler.addNodeDdClass(r,"nodrop"),this.tree.isOverSvg||this.tree.nodesBgContainer.selectAll(".node-bg__border").style("display","none")),!this.tree.hoveredNode||this.isInSameParentNode(t,this.tree.hoveredNode)?(this.actionHandler.addNodeDdClass(r,"nodrop"),this.tree.nodesBgContainer.selectAll(".node-bg__border").style("display","none")):this.actionHandler.changeNodeClasses(e),!0}isInSameParentNode(e,t){return e.parentsStateIdentifier[0]==t.parentsStateIdentifier[0]||e.parentsStateIdentifier[0]==t.stateIdentifier}dragEnd(e){let t=e.subject;if(!this.startDrag||0===t.depth)return!1;let n=this.tree.hoveredNode;if(this.isDragged=!1,this.actionHandler.removeNodeDdClass(),!(t.isOver||n&&-1!==n.parentsStateIdentifier.indexOf(t.stateIdentifier))&&this.tree.settings.canNodeDrag&&this.tree.isOverSvg){let e=this.actionHandler.changeNodePosition(n),t=e.position===s.DraggablePositionEnum.INSIDE?TYPO3.lang["mess.move_into"]:TYPO3.lang["mess.move_after"];t=t.replace("%s",e.node.name).replace("%s",e.target.name),r.confirm(TYPO3.lang.move_folder,t,i.warning,[{text:TYPO3.lang["labels.cancel"]||"Cancel",active:!0,btnClass:"btn-default",name:"cancel"},{text:TYPO3.lang["cm.copy"]||"Copy",btnClass:"btn-warning",name:"copy"},{text:TYPO3.lang["labels.move"]||"Move",btnClass:"btn-warning",name:"move"}]).on("button.clicked",t=>{const s=t.target;"move"===s.name?this.sendChangeCommand("move",e):"copy"===s.name&&this.sendChangeCommand("copy",e),r.dismiss()})}return!0}sendChangeCommand(e,t){let s={data:{}};if("copy"===e)s.data.copy=[],s.copy.push({data:decodeURIComponent(t.identifier),target:decodeURIComponent(t.target.identifier)});else{if("move"!==e)return;s.data.move=[],s.data.move.push({data:decodeURIComponent(t.identifier),target:decodeURIComponent(t.target.identifier)})}this.tree.nodesAddPlaceholder(),new o.default(top.TYPO3.settings.ajaxUrls.file_process+"&includeMessages=1").post(s).then(e=>e.resolve()).then(e=>{e&&e.hasErrors?(this.tree.errorNotification(e.messages,!1),this.tree.nodesContainer.selectAll(".node").remove(),this.tree.update(),this.tree.nodesRemovePlaceholder()):(e.messages&&e.messages.forEach(e=>{n.showMessage(e.title||"",e.message||"",e.severity)}),this.tree.refreshOrFilterTree())}).catch(e=>{this.tree.errorNotification(e,!0)})}}}));