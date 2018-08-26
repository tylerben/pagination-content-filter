(function() {
	// declare variables
	var $page = $( '.page' ),
		$list = $( 'ul.student-list' ),
		$listItems = $( '.student-item' ),
		$pagination = $( '.pagination' ),
		$pageHeader = $( '.page-header' ),
		$search,
		$searchBtn,
		listLength = $listItems.length,
		pagesNeeded = calcPagesNeeded(listLength);

	/**
	 * Function used to append search box to the page
	*/
	(function buildSearchBox() {
		var html = `<div class="student-search">
          <input placeholder="Search for students...">
          <button>Search</button>
        </div>`;
        $pageHeader.append(html);
        $search = $( '.student-search input' ), // update variable with DOM reference after HTML is appended
		$searchBtn = $( '.student-search button' ); // update variable with DOM reference after HTML is appended
	})();

	/**
	 * Function used to calculate the number of pagination links needed
	 * @return {number} [number of pages needed]
	 */
	function calcPagesNeeded(len) {
		return Math.ceil(len/10);
	}

	/**
	 * Function used to show the currently selected page in the directory
	 * @param  {number} pageNo    [The page to show]
	 * @param  {array} listItems [array of objects representing the student list items ]
	 */
	function showPage(pageNo, listItems) {
		var upperBound = pageNo * 10, // upperbound of list item index
			lowerBound = upperBound - 10; // lowerbound of list item index

		for (let i = 0; i < listItems.length; i++) {
			if (i >= lowerBound && i < upperBound) {
				$( listItems[i] ).show();		
			} else {
				$( listItems[i] ).hide();
			}
		}
	}

	/**
	 * Function used to retrieve the user's selected page
	 * @param  {objec} e [Event object]
	 */
	function getPage(e) {
		e.preventDefault();
		var activePage = e.target;
		var pageNo = parseInt($( activePage ).text());
		setActivePage(pageNo, $( '.pagination li' ));
		showPage(pageNo, $( 'li.student-item' ));
	}

	/**
	 * Function used to style the pagination link for the user's selected page
	 * @param {number} pageNo    [the user's selected page number]
	 * @param {object} pageLinks [CSS selector for the pagination list]
	 */
	function setActivePage(pageNo, pageLinks) {
		for (var i = 0; i < pageLinks.length; i++) {
			$( pageLinks[i] ).find('a').removeClass("active");
		}
		$( pageLinks[pageNo - 1] ).find('a').addClass('active');
	}

	/**
	 * Function used to retrieve user's search value from input
	 * Response is converted to lowercase for easier comparison
	 * @return {string} [search input value]
	 */
	function getSearchTerms() {
		return $search.val().toLowerCase();
	}

	/**
	 * Function used to render list items that match the user's search criteria
	 */
	function displaySearchResults() {
		var students = [], // array that will hold student names and email addresses
			matched  = [], // array that will hold list of matched students
			searchTerm = "";

		// Obtain the value of the search input
		searchTerm = getSearchTerms();
    	// remove the previous page link section 
    	removePagination();    	   
    	// Loop over the student list, and for each student…
			// ...obtain the student’s name…
			// ...and the student’s email…
			// ...and the student's index position in the list
		for (let i = 0; i < $listItems.length; i++) {
			$( $listItems[i] ).hide();
			let student = $( $listItems[i] );
				students.push({name: student.find('h3').text().toLowerCase(), email: student.find('span.email').text().toLowerCase(), index: i});
		}
		// ...if the search value is found inside either email or name…
    		// ...add this student to list of “matched” student
    	matched = students.filter(function (d) {
    		return d.name.includes(searchTerm) ||
    			   d.email.includes(searchTerm);
    	});

    	// loop through matched array of students and show student list item at that same index
    	for (let i = 0; i < matched.length; i++) {
    		var index = matched[i].index;
    		$( $listItems[index] ).show();
    	}

    	let searchCount = matched.length; // determine the length of the matched array
    	$list.find('.search-alert').remove(); // remove search alert

    	// if no matches found for user's search criteria display an alert
    	// else build the pagination based on the number of results returned
    	if (matched.length === 0) {    		
    		$list.append('<h3 class="search-alert">No results found for current search. Please alter your search criteria.</h3>')
    	} else {
    		buildPagination(calcPagesNeeded(searchCount));
    	}
	}

	// display user's results on search submit
	$searchBtn.on("click", displaySearchResults)

	/**
	 * Function used to remove pagination links if they exist
	 */
	function removePagination() {
		if ($pagination.length > 0) {
			$pagination.remove();
		};
	}

	/**
	 * Function used to build student list pagination
	 * @return {string} [HTML for pagination]
	 */
	function buildPagination(len) {
		removePagination();
		if (len > 1) {
			var html = '<div class="pagination"><ul>';
			for (let i = 0; i < len; i++) {
				html += '<li><a href="#">' + (i+1) + '</a></li>';
			}
			html += '</ul></div>';
			$page.append(html);
			showPage(1, $( 'li.student-item' ))
			$( '.pagination ul').on("click", getPage)
			setActivePage(1, $( '.pagination li' ));
		}	
		$pagination = $( '.pagination' ); // update DOM reference
	}
	buildPagination(pagesNeeded);

})();