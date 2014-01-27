/**
 * General jQuery Functions
 * ------------------------------
 * Arquivo que contem diversas funcoes e classes javascript, baseadas ou nao em 
 * jQuery, para utilizacao nos sistemas web.
 * 
 * @require : jQuery, general.jquery.js
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 */

// *****************************************************************************

/**
 * .exist()
 * ------------------------------
 * Função que testa se um elemento do DOM existe
 * 
 * @require : jQuery
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    if( $('#item').exist() )
        // Existe...
 * 
 */
(function($) {$.fn.exist = function() {
    return (this.length > 0) ? true : false;
};})(jQuery);

/**
 * .escape()
 * ------------------------------
 * The escape() function encodes a string. This function makes a string portable, 
 * so it can be transmitted across any network to any computer that supports 
 * ASCII characters.
 * This function encodes special characters, with the exception of: * @ - _ + . /
 * 
 * @require : jQuery
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    var escaped = $('#item').escape(); // Codifica o texto contido em '#item'
 * 
 */
(function($) {$.fn.escape = function() {
    return escape(this.val());
};})(jQuery);

/**
 * .disable() / .enable()
 * ------------------------------
 * Essas funcoes extendem o framework jquery para criar uma forma mais facil de 
 * habilitar e desabilitar um elemento.
 * Funcoes similares a .attr('disabled', 'disabled') e .removeAttr('disabled')
 * 
 * @require : jQuery
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    $('#first-name').disable(); // Desabilita o elemento '#first-name'
    $('#first-name').enable();  // Habilita o elemento '#first-name'
 * 
 */
(function ($) {
    $.fn.disable = function () {
       return $(this).each(function () {
            $(this).attr('disabled', 'disabled');
       });
    };
})(jQuery);
(function ($) {
    $.fn.enable = function () {
        return $(this).each(function () {
            $(this).removeAttr('disabled');
        });
    };
})(jQuery);

/**
 * classExists
 * ------------------------------
 * Função que verifica se uma variavel eh ou nao uma classe javascript
 * 
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    if( classExists( LoadingManager ) )
        // Existe...
 * 
 */
classExists = function(c) {
    return ((typeof(c) == 'function' && typeof(c.prototype) == 'object') ? true : false);
}

/**
 * LoadingManager()
 * ------------------------------
 * Função que ativa uma imagem indicativa de 'loading' ao lado de um elemento -
 * a imagem eh apropriada para uso em formularios por causa de seu tamanho; um 
 * exemplo de uso seria as dropdowns dependentes, enquanto a segunda dropdown eh
 * carregada, a imagem de loading eh exibida ao lado da primeira dropdown
 * 
 * @require : jQuery
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    // Inclui uma imagem de loading ao lado do elemento com id 'input_id'
    LoadingManager.startLoading('input_id');
    // Retira a imagem de loading do lado do elemento com id 'input_id'
    LoadingManager.stopLoading('input_id');
 * 
 */
var LoadingManager = {
    startLoading : function(appendTo){
        // Esta imagem pode ser encontrada em 'recursos/images/icons/loading.14x14.gif'
        var img = 'data:image/gif;base64,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';
        //$('#'+appendTo).attr('style','float:left;'); // Aparentemente, nao eh necessario...
        $('#'+appendTo).after('<img id="loading-'+appendTo+'" style="margin: 8px;" src="'+img+'"></img>');
    },
    stopLoading : function(appendedTo){
        //$('#'+appendedTo).attr('style','float:none;'); // Aparentemente, nao eh necessario...
        $('#loading-'+appendedTo).remove();
    }
}

/**
 * validateRequest()
 * ------------------------------
 * Função que faz uma requisição de validação
 * Validações retornam true em caso de sucesso ou um json com as mensagens
 * de erro
 * 
 * @require : jQuery
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    // Indica a 'url' que vai validar os dados ('data')... O retorno eh esperado em 'Json'
    var validacao = validateRequest(url,data);
    if(!validacao.status)
        alert(validacao.msg); // Erro! Alert na mensagem de erro retornada
    else
        // Validado! validacao.msg retorna vazio
 * 
 */
validateRequest = function(url, data){
    
    return {status : true, msg: ''}; // Retirar depois que finalizar os testes!
    
    var validateRequest = {status : false, msg: ''};
    $.ajax({
        url: url,
        data: data,
        async: false, // Bloqueia a execução até que a validação esteja pronta
        success: function(response){
            if(response === 'true'){
                validateRequest = {status : true, msg: ''};
            }else{
                validateRequest = {status : false, msg: response};
            }                    
        },
        error: function(response){
            validateRequest = {status : false, msg: response};
        }
    },'json');

    return validateRequest;
};

/**
 * createAlert()
 * ------------------------------
 * Funcao que cria uma div para informar um status
 * Utiliza as classes 'alert' e 'alert-{success,error,...} para estilo da div
 * 
 * @require : none
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    // Cria uma div para alert de 'error' com id 'frm-msg' e retorna na variavel 'divAlert'
    var divAlert = createAlert('frm-msg','error','<strong>mensagem</strong> que sera informada');
 * 
 */
createAlert = function(fieldId,state,msg){
    var estilo = '';
    switch(state)
    {
        case 'error':
            estilo = 'alert alert-error';
            break;
        case 'success':
            estilo = 'alert alert-success';
            break;
    }
    return '<div id="'+fieldId+'" class="'+estilo+'"><button class="close" data-dismiss="alert" type="button">×</button>'+msg+'</div>';
};

/**
 * AlertManager()
 * ------------------------------
 * Função que exibe uma mensagem no campo de mensagens de um formulario
 * 
 * @require : jQuery
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    // ...
 * 
 */
var AlertManager = {
    showFormError : function(form,target,alertMsg){
        var divAlert = createAlert(target,'error',alertMsg);
        if($('#'+target).exist())
        {
            $('#'+target).remove();
        }
        $('#'+form).before(divAlert);
    },
    showFormSuccess : function(form,target,alertMsg){
        var divAlert = createAlert(target,'success',alertMsg);
        if($('#'+target).exist())
        {
            $('#'+target).remove();
        }
        $('#'+form).before(divAlert);
    }
}

