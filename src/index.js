import React, { Component } from "react";
import ReactDOM from "react-dom";
import autobind from "react-autobind";
import classnames from "classnames";
import arrayToTree from "array-to-tree";
import Tree, { TreeNode } from "rc-tree";

import { gData, madeFakeStruture } from "./util";

import "rc-tree/assets/index.css";
import "font-awesome/scss/font-awesome";
import "./styles.scss";

const NodeIcon = (type) => (
  <i className={classnames('fa', {
    'fa-folder-open-o': type === 'FOLDER',
    'fa-file-o': type === 'PAGE',
  })} aria-hidden="true"></i>
);

const NodeSwitcherIcon = (id, hasChildren) => (
  <i className={classnames('fa', {
    'fa-caret-down': hasChildren && this.isExpanded(id),
    'fa-caret-right': hasChildren && !this.isExpanded(id),
  })} aria-hidden="true"></i>
);

class ScreensPanel extends Component {
  constructor(props) {
    super(props);
    autobind(this);

    this.state = {
      autoExpandParent: true,
      expandedIds: [],
      selectedId: null,
    };
  }

  onDragEnter(info) {
    this.setState({
      expandedIds: info.expandedKeys
    });
  }

  onDrop(info) {

  }

  isExpanded(nodeId) {
    return this.state.expandedIds.indexOf(nodeId) != -1;
  }

  isSelected(nodeId) {
    return this.state.selectedId === nodeId;
  }

  onExpand(expandedIds) {
    this.setState({
      expandedIds,
      autoExpandParent: false
    });
  }

  onSelect(ids) {
    this.setState({ selectedId: ids[0] })
  }

  loop(data, deepLevel = 0, odd = false) {
    return data.map((node, i) => {

      const {
        id,
        name,
        children,
        content: { type },
      } = node;

      const isOdd = (odd ? i + 1 : i) % 2 === 0;
      const hasChildren = children && children.length;

      return (
        <TreeNode
          key={id}
          className={classnames(
            `rc-node-type-${type}`,
            `rc-deep-level-${deepLevel}`,
            { 'rc-node-odd': isOdd }
          )}
          title={name}
          selectable={!this.isSelected(id) && !hasChildren}
          icon={() => NodeIcon(type)}
          switcherIcon={() => NodeSwitcherIcon(id, hasChildren)}>
          {hasChildren && this.loop(children, deepLevel + 1, isOdd)}
        </TreeNode>
      );
    });
  }

  render() {

    if (!this.props.treeData) {
      return <span>Screens not found</span>;
    }

    const tree = madeFakeStruture(10, 10, 1);

    // const tree = arrayToTree(treeData, {
    //   parentProperty: "folderId",
    //   rootID: "root"
    // });

    return (
      <div className="folderView">
        <Tree
          draggable
          readOnly
          className="allowNativeDragDropEvents"
          expandedKeys={this.state.expandedIds}
          autoExpandParent={this.state.autoExpandParent}
          // onDragStart={this.onDragStart}
          onSelect={this.onSelect}
          onDragEnter={this.onDragEnter}
          onDrop={this.onDrop}
          onExpand={this.onExpand}>
          {this.loop(tree)}
        </Tree>
      </div>
    );
  }
}
ReactDOM.render(
  <ScreensPanel treeData={gData} />,
  document.getElementById("app")
);
