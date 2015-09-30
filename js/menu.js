//
// Sets up burger button functionality to show the menu in responsive mode
// and handles item selection and extend-collapse stuff.
//
function setupMenu()
{
    var $menu = $( '.s-header .s-menu nav > ul' );      // menu selector
    var menuExtended = false;                           // indicates whether the menu in resposive mode is extended
    var menuAnimation = new Animation();                // animation class for toggling between extended and collapsed
    var menuCurrMaxHeight = 0;                          // current height

    var $menuItems = ".s-header .s-menu nav ul > li";   // selects the first menu items
    var menuActiveItem = -1;                            // index of the selected item
    var menuResposiveMode = false;                      // indicates whether we are in responsive mode

    //
    // extends the menu
    //
    function extendResponsiveMenu()
    {
        $menu.css( "display", "block" );

        menuAnimation.start( 
            0,
            menuCurrMaxHeight,
            500,
            16,
            1000,
            function( curr )
            {
                menuCurrMaxHeight = curr;
                $menu.css( "max-height", menuCurrMaxHeight + "px" ); 
            },
            function()
            {
                menuExtended = true;
            }
        );
    }

    //
    // collapses the menu
    //
    function collapseResponsiveMenu()
    {
        // turn menu off
        menuAnimation.start( 
            500,
            menuCurrMaxHeight,
            0,
            16,
            1000,
            function( curr ) 
            { 
                menuCurrMaxHeight = curr;
                $menu.css( "max-height", menuCurrMaxHeight + "px" ); 
            },
            function() 
            {
                $menu.css( "display", "none" );
                menuExtended = false;
            }
        );
    }

    //
    // resets the menu to work in non-responsive mode
    //
    function resetResponsiveMenu()
    {
        if( !menuAnimation.isDone())
            menuAnimation.stop();

        menuExtended = false;
        menuCurrMaxHeight = 0;

        $menu.css( "max-height", 0 + "px" );
        $menu.css( "display", "block" );
    }

    //
    // main
    //
    $( function() 
    {
        //
        // click event of burger button
        //
        $( '.s-header .s-menu .s-menu-btn' ).click( function() 
        {
            if( !menuAnimation.isDone())
            {
                menuAnimation.stop();

                if( menuExtended )
                    menuExtended = false;
                else
                    menuExtended = true;
            }

            if( menuExtended )
            {
                collapseResponsiveMenu();
            }
            else
            {
                extendResponsiveMenu();
            }   
        });

        //
        // click event of menu item
        //
        $( $menuItems ).click( function( e ) 
        {
            if( $( $menuItems + ' ul' ).has( e.target ).length !== 0 )
            {
                return;
            }

            if( viewport()[ 'width' ] <= 960 ) 
            {
                var index = $( $menuItems ).index( this );
                
                $( $menuItems + ':eq(' + index + ') ul' ).slideToggle( "slow" );

                if( menuActiveItem != -1 && menuActiveItem != index ) 
                {
                    $( $menuItems + ':eq(' + menuActiveItem + ') ul' ).slideToggle( "slow" );            
                }

                if( menuActiveItem == index ) 
                {
                    menuActiveItem = -1;
                }
                else 
                {
                    menuActiveItem = index;
                }
            }
        });

        //
        // resize event
        //
        $( window ).resize( function() 
        {
            //
            // responsive mode is active
            //
            if( viewport().width <= 960 ) 
            {
                $menu.css( "display", "none" );     // hide menu at the beginning

                $( $menuItems + ' ul' ).hide();     // hide items as well

                menuResposiveMode = true;
            }

            //
            // non-responsive mode is active
            //
            else 
            {
                if( menuResposiveMode )             // just to close menu while not shown
                {
                    resetResponsiveMenu();
                }

                if( menuActiveItem != -1 )          // if an item is still selected -> hide that item
                {
                    $( $menuItems + ':eq(' + menuActiveItem + ') ul' ).slideToggle();                   
                    menuActiveItem = -1;
                }

                $( $menuItems + ' ul' ).show();     // show menu items

                menuResposiveMode = false;
            }
        });
    });
}