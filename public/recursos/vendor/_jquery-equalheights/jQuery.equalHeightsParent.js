/**
 * jQuery equalHeights Extension
 * ------------------------------
 * Essas funcoes extendem as funcionalidades do jQuery equalHeights.
 * As duas funcoes equalHeightsParent e equalWidthsParent funcionam de forma 
 * similar as funcoes equalHeights e equalWidths respectivamente.
 * A diferenca eh que as funcoes originais setam a mesma altura/largura para 
 * todos os elementos children do seletor, enquanto as funcoes deste arquivo
 * setam altura/largura igual para todos os elementos no seletor.
 * Por exemplo:
 * 
 * <ul class="ex">
 *  <li class="item">
 *  <div class="ex-filho"></div>
 *  <div class="ex-filho"></div>
 *  </li>
 *  <li class="item">
 *  <div class="ex-filho"></div>
 *  <div class="ex-filho"></div>
 *  <div class="ex-filho"></div>
 *  </li>
 *  ...
 * </ul>
 * 
 * $('.ex').equalHeights();             // Todos os <li class="item"> possuem agora a mesma altura
 *                                
 * $('.ex .item').equalHeights();       // Todos os <li class="item"> possuem agora a mesma altura
 *                                      // e todas as <div class="ex-filho"> possuem a mesma altura 
 *                                      // que seus irmaos (dentro da mesma <li>)
 *                                      
 * $('.ex .item').equalHeightsParent(); // Todas as <div class="ex-filho"> dentro de <ul class="ex"> 
 *                                      // possuem a mesma altura, independente da <li> onde se encontram
 * 
 * @require : jQuery
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 */

// *****************************************************************************

/**
 * .equalHeightsParent()
 * ------------------------------
 * Seta todos os elementos do seletor com a mesma altura
 * 
 * @require : jQuery
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    $('.thumbnail').equalHeightsParent();
 * 
 */
$.fn.equalHeightsParent = function(px) {
    var elements = $(this);
    var currentTallest = 0;
    elements.each(function(i){
        if ($(this).height() > currentTallest) { currentTallest = $(this).height(); }
    });

    /**
     * A linha abaixo foi alterada
     * Antiga : if (!px || !Number.prototype.pxToEm) currentTallest = currentTallest.pxToEm(); //use ems unless px is specified
     */
    if (!px && Number.prototype.pxToEm) currentTallest = currentTallest.pxToEm(); //use ems unless px is specified

    // for ie6, set height since min-height isn't supported
    if ($.browser.msie && $.browser.version == 6.0) { elements.css({'height': currentTallest}); }
    if ($.browser.msie) { elements.css({'height': currentTallest}); } // Actually, all version of ie need this
    elements.css({'min-height': currentTallest});

    return this;
};

/**
 * .equalWidthsParent()
 * ------------------------------
 * Seta todos os elementos do seletor com a mesma largura
 * 
 * @require : jQuery
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    $('.thumbnail').equalWidthsParent();
 * 
 */
$.fn.equalWidthsParent = function(px) {
    var elements = $(this);
    var currentWidest = 0;
    elements.each(function(i){
        if ($(this).width() > currentWidest) { currentWidest = $(this).width(); }
    });

    /**
     * A linha abaixo foi alterada
     * Antiga : if (!px || !Number.prototype.pxToEm) currentWidest = currentWidest.pxToEm(); //use ems unless px is specified
     */
    if (!px && Number.prototype.pxToEm) currentWidest = currentWidest.pxToEm(); //use ems unless px is specified

    // for ie6, set width since min-width isn't supported
    if ($.browser.msie && $.browser.version == 6.0) { elements.css({'width': currentWidest}); }
    if ($.browser.msie) { elements.css({'width': currentWidest}); } // Actually, all version of ie need this
    elements.css({'min-width': currentWidest});

    return this;
};