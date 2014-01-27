/**
 * FormularyManager()
 * ------------------------------
 * Funcao que manipula o submit de um formulario utilizando AJAX, inclusive com 
 * envio de arquivos
 * 
 * @require : jQuery, jquery.form.js, general.jquery.js
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    // Unbind necessario para evitar o submit padrao do browser
    $('#frm').unbind('submit').submit(function(e) {
        var formManager = new FormularyManager();
        $(this).ajaxSubmit(formManager.getOptions($(this),'pro_id','')); // type = '', 'validate', 'ask-before'

        //e.preventDefault(); // Prevent standard browser submit
        return false; // return false to prevent standard browser submit
    });

    // Acao acionada apos o submit ter sido realizado com sucesso - retona o id criado/alterado
    $('#frm').bind('submit-ready', function(event,id) {
        // Executa acao pos-submit com sucesso!
    });

    // Acao de reset no formulario
    $('#frm').bind('reset', function(e) {
        // Executa acao antes do reset do formulario
    });
 * 
 * : TAREFAS :
 * - ...
 */
function FormularyManager()
{
    /**
     * Funcao acionada antes da submissao do formulario
     * realiza avaliacoes previas antes do envio do formulario, como perguntar se 
     * o usuario tem certeza que deseja proseguir ou validar os dados antes de salvar
     * alguns formularios podem passar por aqui sem acionar nenhuma verificacao, para
     * isso basta a opcao 'formType' vazia ou diferente das previstas
     */
    submitBefore = function(formData, jqForm, options){
        switch(options.formType)
        {
            /**
             * ask-before
             * Verifica se o usuario tem certeza que deseja continuar com o submit
             * Caso ele cancele, interrompemos o processo
             */
            case 'ask-before':
                if (!confirm('Tem certeza que deseja continuar?')){
                    return false;
                }
                break;
            /**
             * validate
             * Valida o formulario - Caso nao seja valido e existe o campo 
             * formMsg para exibir mensagens, informa que ocorreu um Erro;
             */ 
            case 'validate':
                var validacao = validateRequest(options.validate,formData);
                if(!validacao.status){
                    console.log(validacao.msg);
                    var alertMsg = '<strong>Formulário inválido!</strong> Ocorreu um erro no preenchimento das informações';
                    AlertManager.showFormError(options.formId,options.formMsg,alertMsg);
                    return false;
                }
                break;
            //default:
                // Proceder sem verificacao...
        }
    };
    
    /**
     * Em caso de sucesso na submissao do formulario, esta funcao eh acionada
     * Se houver um 'target' valido, ele recebera automaticamente o conteudo de 'responseText'
     */
    submitSuccess = function(responseText, statusText, xhr, $form){
        if(responseText.success){
            var alertMsg = '<strong>Formulário enviado!</strong> Operação realizada com sucesso';
            
            if(responseText.msgs)
                alertMsg += '<pre>'+responseText.msgs+'</pre>';
            
            AlertManager.showFormSuccess(options.formId,options.formMsg,alertMsg);
            
//            // Coloca o id do elemento no campo hidden apropriado
//            if(options.elementId)
//                $('input[name='+options.elementId+']').val(responseText.id);
            
            // Dispara um evento quando o submit foi finalizado retornando o id criado
            // Ideal para executar acoes personalizadas pos-submit
            $('#'+options.formId).trigger('submit-ready',responseText.id);
        }else{
            // Listagem de erros do formulario
            var errors = '';
            if(responseText.msgs)
            {
                errors = '<ul>';
                $.each(responseText.msgs, function(fieldName, fieldMsgs) {
                    errors += '<li>'+$('label[for="'+fieldName+'"]').text()+':';
                    errors += '<ul>';
                    $.each(fieldMsgs, function(errorName, ErrorMsg) {
                        errors += '<li>'+ErrorMsg+'</li>';
                    });
                    errors += '</ul>';
                    errors += '</li>';
                });
                errors += '</ul>';
            }
            
            if(responseText.msgs.xdebug_message)
                errors = '<pre>'+responseText.msgs.xdebug_message+'</pre>';
            
            var alertMsg = '<strong>Erro ao enviar!</strong> '+responseText.results+'<br/>'+errors;

            AlertManager.showFormError(options.formId,options.formMsg,alertMsg);
        }
    };
    /**
     * Em caso de erro na submissao do formulario, esta funcao eh acionada
     * Os erros que fazem esta funcao ser acionada sao erros de 404, 'dataType' invalido, ...
     */
    submitError = function(responseText, statusText){
        var alertMsg = '<strong>Erro ao enviar!</strong> Ocorreu um erro em sua solicitação';

        var respTxt = $.parseJSON(responseText.responseText);
        if(respTxt.content.display_exceptions)
            alertMsg += '<pre>'+respTxt.content.exception.xdebug_message+'</pre>';
        
        AlertManager.showFormError(options.formId,options.formMsg,alertMsg);
        return false;
    };

    //Progress bar elements
    var progress = $('.progress');
    var bar      = $('.bar');
    var percent  = $('.percent');

    fileBeforeSend = function() {
            progress.show();
            var percentVal = '0%';
            bar.width(percentVal)
            percent.html(percentVal);
    };
    fileUploadProgress = function(event, position, total, percentComplete) {
            var percentVal = percentComplete + '%';
            bar.width(percentVal)
            percent.html(percentVal);
    };
    fileComplete = function(xhr) {
            progress.hide(); //xhr.responseText;
    };
    
    // Options para configuracao do jQuery Form Plugin
    var options = {
        beforeSubmit:   submitBefore, 		// pre-submit callback
        success:        submitSuccess, 		// post-submit callback
        error:          submitError,  		// post-submit callback

        beforeSend:     fileBeforeSend,
        uploadProgress: fileUploadProgress,
        complete:       fileComplete,

        // Other available options:
        dataType:  'json'                       // null, 'xml', 'script', or 'json' (expected server response type)
        //target:    '#frm-response'            // target element(s) to be updated with server response
        //type:      'post'                     // 'get' or 'post', override for form's 'method' attribute
        //url:       'submit-form.php'          // override for form's 'action' attribute
        //clearForm: true                       // clear all form fields after successful submit
        //resetForm: true                       // reset the form after successful submit
        
        // $.ajax options can be used here too, for example: 
        //timeout:   3000
    };

    /**
     * Reseta o formulario
     */
    this.clearForm = function(){
        $('#'+options.elementId).resetForm();
    };

    /**
     * Configuracoes do jQuery Form plugin
     */
    this.getOptions = function(form,elementId,type){
        if(!type)
            type = '';
        
        if(!elementId)
            elementId = '';
        
        options.formType  = type; // Valores possiveis : '', 'salvar', 'remover'
        options.elementId = elementId;
        options.formId    = form.attr('id');
        options.formMsg   = form.attr('id')+'-msg';
        options.target    = form.attr('id')+'-response';
        options.type      = form.attr('method');
        options.url       = form.attr('action');
        options.validate  = form.attr('validate');
        options.dataType  = 'json';
        
        return options;
    };
}
