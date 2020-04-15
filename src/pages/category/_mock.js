const category ={'data': [
	{ id:'L1', pId:'L0', name:"父节点 1", open:true},
	{ id:'11', pId:'L1', name:"叶子节点 1-1"},
	{ id:'12', pId:'L1', name:"叶子节点 1-2"},
	{ id:'13', pId:'L1', name:"叶子节点 1-3"},
	{ id:'2', pId:'L0', name:"父节点 2", open:true},
	{ id:'21', pId:'2', name:"叶子节点 2-1"},
	{ id:'22', pId:'2', name:"叶子节点 2-2"},
	{ id:'23', pId:'2', name:"叶子节点 2-3"},
	{ id:'3', pId:'L0', name:"父节点 3", open:true, drop:false},
	{ id:'31', pId:'3', name:"叶子节点 3-1", drag:false, drop:false},
	{ id:'32', pId:'3', name:"叶子节点 3-2", drag:false, drop:false},
	{ id:'33', pId:'3', name:"叶子节点 3-3", drag:false, drop:false}
]};


export default {
  // 支持值为 Object 和 Array
  'GET /api/v1/category': category,
};
