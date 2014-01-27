/**
 * dependentDropDown()
 * ------------------------------
 * Funcao que agrega funcionalidade ao evento onChange de uma dropdown.
 * Utiliza o valor selecionado no evento onChange para buscar os dados referentes 
 * e alimentar uma dropdown filha
 * 
 * @require : jQuery, general.jquery.js
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    // Selecionar uma 'marca', abre uma lista de 'veiculos' da marca
    dependentDropDown('marca','veiculos','url-que-encontra-os-veiculos-de-uma-marca','booleano-colocar-barrinha-de-load-ou-nao?');
 * 
 * : TAREFAS :
 * - TODO : Criacao das <option> usa 'key' como chave do array de options, isso acaba permitindo apenas numeros na 'key' - modificar para tornar livre
 */
dependentDropDown = function(source,target,url,imgLoading){
    // Se o target estiver vazio, eu bloqueio ele...
    if($('#'+target+' option').length <= 1) // Sempre existe a option com valor vazio...
        $('#'+target).disable();
    
    $('#'+source).change(function() {
        
        // Ativar a barrinha de load
        if(imgLoading)
            LoadingManager.startLoading(source);
        
        if($('#'+source).val() != '')
        {
            $.ajax({
                type:  'POST',
                async: false,
                url:   url,
                cache: true,
                data:  { id: $('#'+source).val() },
                success: function(dados){
                    if(dados.success)
                    {
                        if(dados.results != ""){
                            var options = new Array();
                            $.each(dados.results, function(key, value){
                               options[((key) ? key : 0)] = '<option value="' + key + '">' + value + '</option>';
                            });
                            $("#"+target).html(options.join(''));
                            
                            $('#'+target).enable();
                        }
                    }
                },
                error: function(jqXHR,textStatus,errorThrown){
                    var error = $.parseJSON(jqXHR.responseText);
                    var content = error.content;
                    
                    console.log(content.message);
                    if(content.display_exceptions)
                        console.log(content.exception.xdebug_message);
                    
                    //console.log(jqXHR);
                    //console.log(textStatus);
                    //console.log(errorThrown);
                },
                dataType: 'json'
            });
        }else{
            $('#'+target).html('');
            $('#'+target).disable();
        }
        
        // Desativar a barrinha de load
        if(imgLoading)
            LoadingManager.stopLoading(source);
    });
}