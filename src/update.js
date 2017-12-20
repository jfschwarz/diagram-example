export function updateNodes(
  rootNode,
  updateFunction,
  filterFunction = () => true
) {
  const needsUpdate = filterFunction(rootNode)

  let childrenUpdated = false
  const children = rootNode.children.map(child => {
    const updatedChild = updateNodes(child, updateFunction, filterFunction)
    childrenUpdated = childrenUpdated || updatedChild !== child
    return updatedChild
  })

  if (!childrenUpdated && !needsUpdate) {
    return rootNode
  }

  const updatedNode = {
    ...rootNode,
    children,
  }

  return needsUpdate ? updateFunction(updatedNode) : updatedNode
}

export function updateEdges(
  edges,
  updateFunction,
  filterFunction = () => true
) {
  return edges.map(edge => (filterFunction(edge) ? updateFunction(edge) : edge))
}
