var theTable ;
var widthOverhead ;
var heightOverhead ;
var bodyDivOffsetWidth ;
var bodyDivOffsetHeight ;

var notWhitespace = /\S/;
function cleanWhitespace(node) {
  for (var x = 0; x < node.childNodes.length; x++) {
    var childNode = node.childNodes[x]
    if ((childNode.nodeType == 3)&&(!notWhitespace.test(childNode.nodeValue))) {
// that is, if it's a whitespace text node

      node.removeChild(node.childNodes[x])
      x--
    }
    if (childNode.nodeType == 1) {
// elements can have text child nodes of their own
      cleanWhitespace(childNode)
    }
  }
}

function ScrollTable(table)
{
	cleanWhitespace( table ) ;
	var headerRowDiv =    table.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
	var bodyDiv =         table.childNodes[0].childNodes[1].childNodes[1].childNodes[0];
	var headerColumnDiv = table.childNodes[0].childNodes[1].childNodes[0].childNodes[0];
	var footerRowP =      table.childNodes[0].childNodes.length > 2;
	if( footerRowP )
	{
		var footerRowDiv = table.childNodes[0].childNodes[2].childNodes[1].childNodes[0];
	}

	ResizeCells(table);
	
	widthOverhead = headerColumnDiv.offsetWidth + 215 ;
	heightOverhead = headerRowDiv.offsetHeight + 2
		+ document.getElementById("toptable").offsetHeight
		+ document.getElementById("br1").offsetHeight
		+ document.getElementById("titletable").offsetHeight
		+ document.getElementById("br2").offsetHeight
		+ document.getElementById("bottomtable").offsetHeight;
	if( footerRowP )
	{
		heightOverhead = heightOverhead + footerRowDiv.offsetHeight - 165 ;
	}
	bodyDivOffsetWidth = bodyDiv.offsetWidth ;
	bodyDivOffsetHeight = bodyDiv.offsetHeight ;

	headerRowDiv.onscroll =    SyncScrollXh ;
	bodyDiv.onscroll =         SyncScroll ;
	headerColumnDiv.onscroll = SyncScrollY ;
	if( footerRowP ) { footerRowDiv.onscroll = SyncScrollXf }
	window.onresize = ResizeScrollArea;
	
	theTable  = table ;
		
	ResizeScrollArea();	
}

function ResizeCells(table)
{
	var headerCnrDiv =    table.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
	var headerRowDiv =    table.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
	var headerColumnDiv = table.childNodes[0].childNodes[1].childNodes[0].childNodes[0];
	var bodyDiv =         table.childNodes[0].childNodes[1].childNodes[1].childNodes[0];
	var footerRowP =      table.childNodes[0].childNodes.length > 2;
	if( footerRowP )
	{
		var footerCnrDiv = table.childNodes[0].childNodes[2].childNodes[0].childNodes[0];
		var footerRowDiv = table.childNodes[0].childNodes[2].childNodes[1].childNodes[0];
	}

	SetWidths(
		   headerCnrDiv.childNodes[0].childNodes[0].childNodes[0].childNodes,
		headerColumnDiv.childNodes[0].childNodes[0].childNodes[0].childNodes) ;
		
	if( bodyDiv.childNodes[0].childNodes[0].childNodes[0].childNodes.length < 14  )
	{
		if( footerRowP )
		{
			SetWidths(
				headerRowDiv.childNodes[0].childNodes[0].childNodes[0].childNodes,
				     bodyDiv.childNodes[0].childNodes[0].childNodes[0].childNodes,		
				footerRowDiv.childNodes[0].childNodes[0].childNodes[0].childNodes) ;
		}
		else
		{
			SetWidths(
				headerRowDiv.childNodes[0].childNodes[0].childNodes[0].childNodes,
				     bodyDiv.childNodes[0].childNodes[0].childNodes[0].childNodes) ;
		}
	}

	SetHeights2(headerCnrDiv.childNodes[0], headerRowDiv.childNodes[0]);

	SetHeights2(headerColumnDiv.childNodes[0], bodyDiv.childNodes[0]);
		        
	if( footerRowP )
	{
		SetHeights2(footerCnrDiv.childNodes[0], footerRowDiv.childNodes[0]);
	}
}

function SetWidths(array1, array2, array3)
{
	for (i = 0; i < array1.length; i++)
	{
		if( array3 != null )
		{
			SetWidth( array1[i], array2[i], array3[i] ) ;
		}
		else
		{
			SetWidth( array1[i], array2[i], null ) ;
		}
	}
}

function SetWidth(element1, element2, element3)
{
	var w = element1.offsetWidth ;
	if (element2.offsetWidth > w) { w = element2.offsetWidth } ;
	if (element3 != null && element3.offsetWidth > w) { w = element3.offsetWidth } ;

	element1.childNodes[0].style.width = w + "px" ;
	element2.childNodes[0].style.width = w + "px" ;
	if(element3 != null ) { element3.childNodes[0].style.width = w + "px" } ;
}

function SetHeights(array1, array2)
{
	for (i = 0; i < array1.length; i++)
	{
		SetHeight( array1[i], array2[i] ) ;
	}
}

function SetHeight(element1, element2)
{
	var h = element1.childNodes[0].offsetHeight;
	if (element2.childNodes[0].offsetHeight > h) { h = element2.offsetHeight } ;

	element1.childNodes[0].childNodes[0].style.height = h + "px";
	element2.childNodes[0].childNodes[0].style.height = h + "px";
}

function SetHeights2(tab1, tab2)
{
	var isIE = !!document.all ;
	if( isIE ) { var offset = -5 } else { var offset = 0 } ;
	for( i=0 ; i<tab1.rows.length ; i++ )
	{
		if( tab1.rows[i].offsetHeight > tab2.rows[i].offsetHeight ) 
		{
			tab2.rows[i].style.height = tab1.rows[i].offsetHeight + offset + "px" ;
			tab1.rows[i].style.height = tab1.rows[i].offsetHeight + offset + "px" ;
		}
		else
		{
			tab1.rows[i].style.height = tab2.rows[i].offsetHeight + offset + "px" ;
			tab2.rows[i].style.height = tab2.rows[i].offsetHeight + offset + "px" ;
		}
	}
}

function ResizeScrollArea()
{
	var scrollbarWidth = 17 ;
	var isIE = !!document.all ;

	var headerCnrDiv =    theTable.childNodes[0].childNodes[0].childNodes[0].childNodes[0] ;
	var headerRowDiv =    theTable.childNodes[0].childNodes[0].childNodes[1].childNodes[0] ;
	var headerColumnDiv = theTable.childNodes[0].childNodes[1].childNodes[0].childNodes[0] ;
	var bodyDiv =         theTable.childNodes[0].childNodes[1].childNodes[1].childNodes[0] ;
	var footerRowP =      theTable.childNodes[0].childNodes.length > 2 ;
	if( footerRowP )
	{
		var footerRowDiv = theTable.childNodes[0].childNodes[2].childNodes[1].childNodes[0] ;
	}

	var availableBodyWidth = document.documentElement.clientWidth - widthOverhead ;
	var availableBodyHeight = document.documentElement.clientHeight  - heightOverhead ;
	var scrollX = (availableBodyWidth < bodyDivOffsetWidth) ;
	var scrollY = (availableBodyHeight < bodyDivOffsetHeight) ;

	if( scrollX ) { availableBodyHeight = availableBodyHeight - scrollbarWidth } ;
	if( scrollX && !isIE ) { availableBodyHeight = availableBodyHeight - scrollbarWidth } ;
	if( scrollY ) { availableBodyWidth = availableBodyWidth - scrollbarWidth } ;

	if( bodyDivOffsetWidth < availableBodyWidth ) { 
		availableBodyWidth = bodyDivOffsetWidth ;
		//if( scrollY ) { availableBodyWidth = availableBodyWidth + scrollbarWidth } }
		if( scrollY ) { availableBodyWidth = availableBodyWidth } }
	if( bodyDivOffsetHeight < availableBodyHeight ) { 
		availableBodyHeight = bodyDivOffsetHeight ;
		//if( scrollX ) { availableBodyHeight = availableBodyHeight + scrollbarWidth } 
		if( scrollX && !(footerRowP && isIE) ) { availableBodyHeight = availableBodyHeight + scrollbarWidth } 
		}

	var maybeNoScrollbarWidth = availableBodyWidth ;
	var maybeNoScrollbarHeight = availableBodyHeight ;

	if( scrollX && !(footerRowP && isIE)  )
	{
		maybeNoScrollbarHeight = maybeNoScrollbarHeight - scrollbarWidth ;
	}
	
	if( scrollY ) { maybeNoScrollbarWidth = maybeNoScrollbarWidth - scrollbarWidth }
	
	headerRowDiv.style.overflow = "hidden" ;
	headerRowDiv.style.width = maybeNoScrollbarWidth + "px" ;
	
	headerColumnDiv.style.overflow = "hidden" ;
	headerColumnDiv.style.height = maybeNoScrollbarHeight + "px" ;

	bodyDiv.style.width = availableBodyWidth + "px" ;
	bodyDiv.style.height = availableBodyHeight + "px" ;
	bodyDiv.style.overflow = "scroll" ;
	
	if ( scrollX && !(footerRowP && isIE) )
	{
		bodyDiv.style.overflowX = "scroll" ;
	}
	else
	{
		bodyDiv.style.overflowX = "hidden" ; // scroll for firefox
	}
	if ( scrollY )
	{
		bodyDiv.style.overflowY = "scroll" ;
	}
	else
	{
		bodyDiv.style.overflowY = "hidden" ; // scroll for firefox
	}
	
	if( footerRowP ) 
	{ 
		footerRowDiv.style.overflow = "hidden" ;
		footerRowDiv.style.width = maybeNoScrollbarWidth + "px"
		if ( scrollX )
		{
			footerRowDiv.style.overflow = "scroll" ;
			footerRowDiv.style.overflowX = "scroll" ;
			footerRowDiv.style.overflowY = "hidden" ; 
		}
	}
	
}

function SyncScrollXh()
{
	var headerRowDiv =    theTable.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
	var bodyDiv =         theTable.childNodes[0].childNodes[1].childNodes[1].childNodes[0];

	bodyDiv.scrollLeft = headerRowDiv.scrollLeft;
	
	if( theTable.childNodes[0].childNodes.length > 2 ) 
	{
		theTable.childNodes[0].childNodes[2].childNodes[1].childNodes[0].scrollLeft = headerRowDiv.scrollLeft;
	}
}

function SyncScrollXf()
{
// Only called by footerRowDiv
	var headerRowDiv =    theTable.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
	var bodyDiv =         theTable.childNodes[0].childNodes[1].childNodes[1].childNodes[0];
	var footerRowDiv =    theTable.childNodes[0].childNodes[2].childNodes[1].childNodes[0];

	headerRowDiv.scrollLeft = footerRowDiv.scrollLeft;
	bodyDiv.scrollLeft = footerRowDiv.scrollLeft;
}

function SyncScroll()
{
	var headerRowDiv =    theTable.childNodes[0].childNodes[0].childNodes[1].childNodes[0];
	var bodyDiv =         theTable.childNodes[0].childNodes[1].childNodes[1].childNodes[0];
	var headerColumnDiv = theTable.childNodes[0].childNodes[1].childNodes[0].childNodes[0];

	headerRowDiv.scrollLeft = bodyDiv.scrollLeft;
	headerColumnDiv.scrollTop = bodyDiv.scrollTop;
	
	if( theTable.childNodes[0].childNodes.length > 2 )
	{
		theTable.childNodes[0].childNodes[2].childNodes[1].childNodes[0].scrollLeft = bodyDiv.scrollLeft;
	}
}

function SyncScrollY()
{
	var headerColumnDiv = theTable.childNodes[0].childNodes[1].childNodes[0].childNodes[0];
	var bodyDiv =         theTable.childNodes[0].childNodes[1].childNodes[1].childNodes[0];

	bodyDiv.scrollTop = headerColumnDiv.scrollTop;
}