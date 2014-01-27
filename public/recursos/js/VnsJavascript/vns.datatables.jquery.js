/* Ordenacao customizada
 * Os trechos a seguir, modificam o DataTables para oferecer novos tipos de ordenacao
 */
/* Ordenador de porcentagens para o DataTable */
jQuery.extend(jQuery.fn.dataTableExt.oSort,{
    "percent-pre": function ( a ) {
        var x = (a == "-") ? 0 : a.replace( /%/, "" );
        return parseFloat( x );
    },

    "percent-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "percent-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});
/* Ordenador de datas do tipo dd/mm/yyyy para o DataTable */
jQuery.extend( jQuery.fn.dataTableExt.oSort,{
    "date-uk-pre": function ( a ) {
        var ukDatea = a.split('/');
        return (ukDatea[2] + ukDatea[1] + ukDatea[0]) * 1;
    },

    "date-uk-asc": function ( a, b ) {
        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    },

    "date-uk-desc": function ( a, b ) {
        return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    }
});

/* Integracao com Bootstrap 3
 * Os trechos a seguir, modificam o DataTables para integracao com o Bootstrap 3
 * http://stackoverflow.com/questions/20071436/datatable-pagination-next-enabled-when-showing-records-all-how-to-disable-it
 */
/* Set the defaults for DataTables initialisation */
jQuery.extend(true, jQuery.fn.dataTable.defaults, {
    //"sDom": "<'row'<'col-xs-6'l><'col-xs-6'f>r>t<'row'<'col-xs-6'i><'col-xs-6'p>>",
    "sDom": "<'row'<'col-xs-6'l><'col-xs-2 pull-right'f>r>t<'row'<'col-md-4 pull-left'i><'col-md-6 pull-right'p>>",
    
    "sPaginationType": "bootstrap",
    "oLanguage": {
        "sLengthMenu": "_MENU_ records per page"
    }
});
/* Default class modification */
jQuery.extend(jQuery.fn.dataTableExt.oStdClasses, {
    "sWrapper": "dataTables_wrapper form-inline",
    "sFilterInput": "form-control input-sm",
    "sLengthSelect": "form-control input-sm"
});
/* API method to get paging information */
jQuery.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings){
    return {
        "iStart":         oSettings._iDisplayStart,
        "iEnd":           oSettings.fnDisplayEnd(),
        "iLength":        oSettings._iDisplayLength,
        "iTotal":         oSettings.fnRecordsTotal(),
        "iFilteredTotal": oSettings.fnRecordsDisplay(),
        "iPage":          oSettings._iDisplayLength === -1 ?
            0 : Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
        "iTotalPages":    oSettings._iDisplayLength === -1 ?
            0 : Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
    };
};
/* Bootstrap style pagination control */
jQuery.extend(jQuery.fn.dataTableExt.oPagination, {
    "bootstrap": {
        "fnInit": function( oSettings, nPaging, fnDraw ) {
            var oLang = oSettings.oLanguage.oPaginate;
            var fnClickHandler = function ( e ) {
                e.preventDefault();
                if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
                    fnDraw( oSettings );
                }
            };

            $(nPaging).append(
                '<ul class="pagination">'+
                    '<li class="prev disabled"><a href="#">&larr; '+oLang.sPrevious+'</a></li>'+
                    '<li class="next disabled"><a href="#">'+oLang.sNext+' &rarr; </a></li>'+
                '</ul>'
            );
            var els = $('a', nPaging);
            $(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
            $(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
        },

        "fnUpdate": function ( oSettings, fnDraw ) {
            var iListLength = 5;
            var oPaging = oSettings.oInstance.fnPagingInfo();
            var an = oSettings.aanFeatures.p;
            var i, ien, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

            if ( oPaging.iTotalPages < iListLength) {
                iStart = 1;
                iEnd = oPaging.iTotalPages;
            }
            else if ( oPaging.iPage <= iHalf ) {
                iStart = 1;
                iEnd = iListLength;
            } else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
                iStart = oPaging.iTotalPages - iListLength + 1;
                iEnd = oPaging.iTotalPages;
            } else {
                iStart = oPaging.iPage - iHalf + 1;
                iEnd = iStart + iListLength - 1;
            }

            for ( i=0, ien=an.length ; i<ien ; i++ ) {
                // Remove the middle elements
                $('li:gt(0)', an[i]).filter(':not(:last)').remove();

                // Add the new list items and their event handlers
                for ( j=iStart ; j<=iEnd ; j++ ) {
                    sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
                    $('<li '+sClass+'><a href="#">'+j+'</a></li>')
                        .insertBefore( $('li:last', an[i])[0] )
                        .bind('click', function (e) {
                            e.preventDefault();
                            oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
                            fnDraw( oSettings );
                        } );
                }

                // Add / remove disabled classes from the static elements
                if ( oPaging.iPage === 0 ) {
                    $('li:first', an[i]).addClass('disabled');
                } else {
                    $('li:first', an[i]).removeClass('disabled');
                }

                if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
                    $('li:last', an[i]).addClass('disabled');
                } else {
                    $('li:last', an[i]).removeClass('disabled');
                }
            }
        }
    }
});
/* TableTools Bootstrap compatibility - Required TableTools 2.1+ */
if (jQuery.fn.DataTable.TableTools) {
        // Set the classes that TableTools uses to something suitable for Bootstrap
    jQuery.extend( true, jQuery.fn.DataTable.TableTools.classes, {
        "container": "DTTT btn-group",
        "buttons": {
            "normal": "btn btn-default",
            "disabled": "disabled"
        },
        "collection": {
            "container": "DTTT_dropdown dropdown-menu",
            "buttons": {
                "normal": "",
                "disabled": "disabled"
            }
        },
        "print": {
            "info": "DTTT_print_info modal"
        },
        "select": {
            "row": "active"
        }
    } );

    // Have the collection use a bootstrap compatible dropdown
    jQuery.extend( true, jQuery.fn.DataTable.TableTools.DEFAULTS.oTags, {
        "collection": {
            "container": "ul",
            "button": "li",
            "liner": "a"
        }
    } );
}

/**
 * DataTableManager()
 * ------------------------------
 * Funcao que manipula uma tabela, transformando-a em uma avancada Data Table.
 * Configura e estiliza a tabela para que ela seja capaz de buscar, ordenar e paginar
 * sem auxilio de codigo server-side
 * 
 * Essa funcao eh capaz de utilizar os estilos do Bootstrap, from Twitter. para isso,
 * Inclua na pagina o script jquery.dataTables.bootstrap.js e o estilo dttable_bootstrap.css
 * 
 * Para utiliza-lo com o estilo padrao, inclua apenas o estilo dttable_custom.css
 * 
 * @require : jQuery, jquery.dataTables.js
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    <table id="produtos" cellpadding="0" cellspacing="0" border="0" class="table">
        <thead>
            <tr>
                <th>...</th>
                <th class="actions">Ações</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>...</td>
                <td class="actions">
                    <button class="btn" title="Visualizar Produto"><i class="icon-eye-open"></i></button><br/>
                    <button class="btn" title="Editar Produto"    ><i class="icon-edit"    ></i></button><br/>
                    <button class="btn" title="Remover Produto"   ><i class="icon-trash"   ></i></button><br/>
                </td>
            </tr>
        </tbody>
    </table>

    $(document).ready(function() {
        var dtTableManager = new DataTableManager();
        var coldefs = [
             { "bVisible":    false,    "aTargets": [ 0 ] }         // Define quais colunas nao sao visiveis - codigo
            ,{ "bSortable":   false,    "aTargets": [ -1 ] }        // Define quais colunas nao sao ordenaveis - actions
            ,{ "bSearchable": false,    "aTargets": [ -1 ] }        // Define quais colunas nao participam de buscas - actions
            ,{ "sWidth":      "180px",  "aTargets": [ 1, -2 ] }     // Define largura das colunas - imagem e preco
            ,{ "sWidth":      "75px",   "aTargets": [ -1 ] }        // Define largura das colunas - actions
            ,{ "sClass":      "center", "aTargets": [ 1, -1, -2 ] } // Centraliza as colunas - imagem, preco, actions
        ]
        dtTableManager.createDatatable($('.table'),coldefs);

        // Acao para os botoes de acao em cada linha da tabela - exibe o codigo do elemento
        $('td.actions .btn').live('click',function(){
            var id = dtTableManager.getId($(this).parent()[0]);
            alert('Id do elemento : '+id); // Id escondido na primeira coluna
        });
    });
 * 
 * : TAREFAS :
 * - ...
 */
function DataTableManager()
{
    var dttable;
    var toolbar_elements;

    /**
     * Pega o id do elemento. Pressume que o id esteja 
     * na primeira coluna da tabela
     */
    this.getData = function(node,pos){
        if(!pos)
            pos = 0;
        
        var aPos = dttable.fnGetPosition(node); // Get the position of the current data from the node
        var aData = dttable.fnGetData(aPos[0]); // Get the data array for this row
        return aData[pos];
    };

    /**
     * Retorna a linha onde se encontra determinado elemento
     */
    this.getRow = function(node){
        var aPos = dttable.fnGetPosition(node); // Get the position of the current data from the node
        return aPos[0];
    };

    /**
     * Remove uma linha em uma determinada posicao.
     * Retorna a linha deletada
     */
    this.deleteRow = function(pos){
        return dttable.fnDeleteRow(pos);
    };

    this.setCellValue = function(value,row,pos){
	    dttable.fnUpdate(value, parseInt(row), parseInt(pos));
    };
    
    /**
     * Recebe elementos adicionais a serem colocados na toolbar da datatable.
     * A toolbar eh uma div criada no topo esquerdo da datatable
     */
    this.setToolbarElements = function(el){
        toolbar_elements = el;
    };
    
    /**
     * Cria uma DataTable a partir de uma tabela passada.
     * Configura as colunas de acordo com o parametro coldefs passado para a funcao
     */
    this.createDatatable = function(element,coldefs,elementsPage,sortFixed){
        // Armazena o id da tabela utilizada
        var tableId = element.attr('id');

        //if(!coldefs)
        //    coldefs = [];
        
        if(!elementsPage)
            elementsPage = 10;
        
        if(!sortFixed)
            sortFixed = [];

        dttable = element.dataTable({
            //"sDom": "<'row'<'col-6'f><'col-6'l>r>t<'row'<'col-6'i><'col-6'p>>",
            
            "oLanguage": {
                "sUrl": "/recursos/vendor/datatables/lang/pt_BR/lang.txt"
            },

            "bPaginate": true,			// Enable or disable pagination
            "sPaginationType": "bootstrap",	// DataTables features two different built-in pagination interaction methods ('two_button' or 'full_numbers')

            //"sScrollY": 	"700px",        // Enable vertical scrolling

            "bSortClasses": 	false,		// Enable or disable the addition of the classes 'sorting_1', 'sorting_2' and 'sorting_3' to the columns which are currently being sorted on					
            "iDisplayLength":	elementsPage,	// Number of rows to display on a single page when using pagination
            "bLengthChange": 	false,		// Allows the end user to select the size of a formatted page from a select menu (sizes are 10, 25, 50 and 100)
            "bFilter": 		true,		// Enable or disable filtering of data
            "bSort": 		true,		// Enable or disable sorting of columns
            "bInfo": 		true,		// Enable or disable the table information display
            "bAutoWidth": 	false,		// Enable or disable automatic column width calculation

            "aoColumnDefs": coldefs,
            /*
            "aoColumnDefs": [
                 { "bSortable":   false,   "aTargets": [ -1 ] }   // Define quais colunas nao sao ordenaveis
                ,{ "bSearchable": false,   "aTargets": [ -1 ] }   // Define quais colunas nao participam de buscas
                ,{ "sWidth":      "120px", "aTargets": [ 0, 2 ] } // Define largura das colunas
                ,{ "sWidth":      "75px",  "aTargets": [ -1 ] }   // Define largura das colunas
            ],
            */

            // Fixa a ordenacao de uma coluna
            "aaSortingFixed": sortFixed,
            /*
            "aaSortingFixed": [ [ 0, 'asc' ] ],
            */

            /* ---| Table Tools |-------------------------------------------- */
            /*
            "oTableTools": {
                "sSwfPath": "/recursos/vendor/data-tables/1.9.1/extra-tools/swf/copy_csv_xls_pdf.swf",
                "aButtons": [
                    {
                        "sExtends": "copy",
                        "sButtonText": "Copiar valores"
                    },
                    {
                        "sExtends": "xls",
                        "sButtonText": "Exportar para Excel"
                    },
                    {
                        "sExtends": "print",
                        "sButtonText": "Imprimir",
                        "sInfo": "<center><h2>Visualizar Impressão</h2><br/><br/>Para imprimir, tecle <b>CTRL+P</b><br/>Para Sair, tecle <b>ESC</b></center>"
                    }
                ]
            },
            */
            
            /* ---| Processamento Server-Side |------------------------------ */
            /*
            "bProcessing": true,
            "bServerSide": true,
            "sAjaxSource": "dttable.php",
            
            "fnServerParams": function ( aoData ) {
                aoData.push({ 
                    "name": "informacao", "value": "extra"
                });
            },
            */
            
            "fnDrawCallback": function( oSettings ) {
                var table = oSettings.sInstance; // Nome do elemento dataTable - Ex. $('#dttable').dataTable( ... );
                
                /* Take the brutal approach to cancelling text selection */
                $('.paginate_button, thead').bind( 'mousedown',   function () { return false; } );
                $('.paginate_button, thead').bind( 'selectstart', function () { return false; } );
                
                /* Ação para o botão de limpar filtros anexado ao campo de filtros */
                /* Este eh o codigo final para a inclusao do botao - seguindo o Bootstrap 3
                <div id="comentarios_filter" class="dataTables_filter">
                    <label>Procurar: 
                        <div class="input-group">
                            <input type="text" class="form-control input-sm" aria-controls="comentarios" placeholder="Procurar">
                            <span class="input-group-btn">
                                <button type="button" class="btn btn-default btn-sm" id="comentarios-clear-filter">
                                    <span class="glyphicon glyphicon-remove"></span>
                                </button>
                            </span>
                        </div>
                    </label>
                </div>
                */
                // Procura no campo '_filter', por algum elemento com a classe, '.input-group-btn'; Se nao existir,
                // é pq o botao de limpar o campo de pesquisa ainda nao foi adicionado e, portanto, precisa ser incluido
                if(!$('.input-group-btn', $('#'+table+'_filter')).length){
                    // Botao que vai limpar o campo de busca
                    var botao = '<span class="input-group-btn">' +
                                '   <button type="button" class="btn btn-default btn-sm" id="'+table+'-clear-filter">' +
                                '       <span class="glyphicon glyphicon-remove"></span>' +
                                '   </button>' +
                                '</span>';
                    // Customiza o campo de busca e adiciona o botao
                    $('input','#'+table+'_filter label').addClass('form-control input-sm')
                                                        .attr('style','box-sizing:border-box; -moz-box-sizing:border-box;')
                                                        .attr('placeholder','Buscar...')
                                                        .after($(botao));
                    $('input','#'+table+'_filter label').next().addBack()
                                                        .wrapAll('<div class="input-group"/>');
                    
                    // Tira o elemento de dentro da tag label; tira o texto 'buscar' do label; recoloca o elemento no label
                    var $busca = $('input','#comentarios_filter label').parent();
                    $busca.parent().after($busca);
                    $('#comentarios_filter label').text('').append($busca);
                    
                    // Adiciona a funcionalidade de limpar campo ao botao inserido
                    $('#'+table+'-clear-filter').click(function(){
                        dttable.fnFilter('');
                        return false;
                    });
                }

                // Alinhamento dos campos de busca e paginacao
                $('#'+table+'_filter').addClass('pull-right');
                $('.dataTables_paginate').addClass('pull-right');
                $('.dataTables_paginate > ul').css('margin', '0');
                $('.dataTables_info').css('line-height', '39px').css('vertical-align', 'middle');

                /* Para retirar o efeito 'piscante' no carregamento da tabela - via ajax -, aconselha-se criá-la oculta ( display: none; ) */
                $('#'+oSettings.sTableId).show(); // Utilizado para mostrar a tabela - caso esteja oculta
                
                // Se foi passado algum elemento, coloca-o na toolbar
                if(toolbar_elements)
                    $('div.toolbar').html(toolbar_elements);
            }
        });
    }
}