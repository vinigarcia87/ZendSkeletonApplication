
// Sobreescrevendo funcoes internas no Fine Uploader
qq.extend(qq.FileUploader.prototype, {
    // Sobreescrevendo a funcao do Fine Uploader que formata nomes extensos...
    _formatFileName: function(name){
        //if (name.length > 33){
        //    name = name.slice(0, 19) + '...' + name.slice(-13);
        //}
        return name;
    }//,
    /*
    // Sobreescrevendo a funcao do Fine Uploader que limpa a lista de arquivos...
    clearStoredFiles: function() {
        qq.FileUploaderBasic.prototype.clearStoredFiles.apply(this, arguments);
        //this._listElement.innerHTML = "";
    }
    */
});

/**
 * FineUploadManager()
 * ------------------------------
 * Função que administra um preview de arquivos no momento do upload
 * Gera um thumbnail para imagens e exibe icones para os demais arquivos
 * Utiliza o plugin Fine Uploader para realizar o upload das imagens
 * - Nos browsers que nao possuam File API eh utilizado o Fine Uploader com 
 * sua listagem normal de arquivos (sem thumbs)
 * 
 * @require : jQuery, File API (opcional), fileuploader.2.1.2.js, jQuery.equalHeights.js, icones 'file-type'
 * @date    : 2012-12-26
 * @author  : Vinicius Oliveira Garcia
 * 
 * .. Exemplo de uso
    <div id="manual-fine-uploader">
            <noscript>
                    <p>Please enable JavaScript to use file uploader.</p>
                    <!-- or put a simple form for upload here -->
            </noscript>
    </div>
    <div id="triggerUpload" class="btn btn-primary" style="margin-top: 10px;"><i class="icon-upload icon-white"></i> Upload now</div>
    <script>
        $(document).ready(function(){
            var fineUpManager = new FineUploadManager();
            fineUpManager.initializeUploader($('#manual-fine-uploader')[0],'upload.php');

            $('#triggerUpload').click(function(){
                fineUpManager.startUpload();
            });
        });
    </script>

    // Exemplo de criacao dinamica do fineUploader...
    var fineUploader = '<div class="control-group">'+
                           '<label class="control-label"></label>'+
                           '<div class="controls">'+
                               '<div id="manual-fine-uploader"></div>'+
                           '</div>'+
                       '</div>';
    $('.form-actions').before(fineUploader);
 * 
 * : TAREFAS :
 * - TODO : ...
 */
function FineUploadManager()
{
    var manualuploader;
    // Parametros que sao passados para a requisicao de upload de arquivo
    var params;
    // Numero maximo de arquivos permitidos
    var fileLimit;
    // Contador de arquivos...
    var count = {
        files:   0, // Numero total de arquivos
        success: 0, // Numero de arquivos que foram uploaded com sucesso
        error:   0  // Numero de arquivos que causaram erros
    };
    var fileCount;      // Contagem de arquivos selecionados
    var completedFiles; // Contagem de arquivos completados - com ou sem sucesso
    
    // String contendo thumbs para serem anexadas no container - exibicao, somente!
    var extra_thumbs = '';
    
    // Diretorio onde se encontram os icones de tipos de arquivos
    var iconsPath = '/recursos/images/icons/file-type/';

    var baseUrlforImages = '/upload/';

    // Esquema de templates para exibir thumbnails
    var tmplThumb = {
        template : '<div class="qq-uploader">' +
                        '<pre class="qq-upload-drop-area"><span>{dragText}</span></pre>' +
                        '<div class="qq-upload-button btn" style="width: auto;">{uploadButtonText}</div>' +
                        '<div class="qq-upload-list container-imgshow thumbnails"></div>'+
                   '</div>',

        fileTemplate : '<div class="imgshow thumbnail">' +
                            '<button class="qq-upload-cancel close" data-dismiss="imgshow" type="button">×</button>'+
                            '<div class="qq-progress-bar"></div>'+
                            '<span class="qq-upload-spinner" style="display: none;"></span>'+
                            '<span class="qq-upload-finished"></span>'+
                            '<img class="thumb"/>'+
                            '<span class="qq-upload-file"></span>'+
                            '<span class="qq-upload-size" style="display: none;"></span>'+
                            '<hr style="margin: 10px 0;" />'+
                            '<span class="thumb-extra">'+
                            '<label class="radio"><input type="radio" name="img-destaque"/>Destaque</label>'+
                            '</span>'+
                            '<span class="qq-upload-failed-text">{failUploadtext}</span>'+
                      '</div>'
    }

    // Esquema de templates para exibir lista de arquivos
    var tmplList = {
        template : '<div class="qq-uploader">' +
                        '<div class="qq-upload-drop-area"><span>{dragText}</span></div>' +
                        '<div class="qq-upload-button btn">{uploadButtonText}</div>' +
                        '<ul class="qq-upload-list container-imgshow"></ul>'+
                   '</div>',

        fileTemplate : '<li>' +
                            '<div class="qq-progress-bar"></div>' +
                            '<span class="qq-upload-spinner"></span>' +
                            '<span class="qq-upload-finished"></span>' +
                            '<span class="qq-upload-file"></span>' +
                            '<span class="qq-upload-size"></span>' +
                            '<a class="qq-upload-cancel" href="#">{cancelButtonText}</a>' +
                            '<span class="qq-upload-failed-text">{failUploadtext}</span>' +
                        '</li>'
    }

    // Opcoes basicas para o uploader
    var fineOptions = {
        //element: document.getElementById('manual-fine-uploader'), // $('#manual-fine-uploader')[0]
        //action: 'upload.php',

        params: {},
        forceMultipart: true,
        autoUpload: false,
        debug: false,
        stopOnFirstInvalidFile: false,
        uploadButtonText: '<i class="icon-plus"></i> Incluir imagens', // <i class="icon-download"></i>
        cancelButtonText: 'Cancelar',

        // Controle de mensagens de falha...
        failUploadText: 'Arquivo falhou',
        failedUploadTextDisplay: {
            mode: 'custom',
            maxChars: 50,
            responseProperty: 'error',
            enableTooltip: true
        },

        // Templates para o html
        //template: template, // template for the main element
        //fileTemplate: fileTemplate, // template for one item in file list

        // Controle de arquivos que podem ser enviados
        //minSizeLimit: 0,
        //sizeLimit: 51200, // 50 kB = 50 * 1024 bytes
        //allowedExtensions: ['jpeg', 'jpg', 'txt'],
        
        // Mensagem de erro a ser mostrada
        showMessage: function(message){
            if($('div[name=qq-msg-erro]').exist())
                $('div[name=qq-msg-erro]').remove();
            
            message = 'Permitidas apenas imagens com as extensões '+fineOptions.allowedExtensions+' e com tamanho de até 10Mb';
            
            $('.qq-upload-button').after('<div name="qq-msg-erro" class="alert alert-error fade in" style="margin: 0">' + message + '</div>');
            
            setTimeout(function(){
                $('div[name=qq-msg-erro]').alert('close');
            }, 5000);
        },

        onError: function(id, fileName, errorReason)
        {
            //alert('onError!');
        },
        onCancel: function(id, fileName)
        {
            //alert('onCancel!');

            count.files--; // Decrementa o numero de arquivos selecionados
            if(fileLimit && count.files < fileLimit){
                $('div.qq-upload-button').enable();
                $('div.qq-upload-drop-area').enable();
                
                // Nao sei pq as linhas acima nao funcionaram... =(
                $('div.qq-upload-button').removeAttr('disabled');
                $('div.qq-upload-drop-area').removeAttr('disabled');
            }
            // Ajusta as dimensoes dos thumbs
            setTimeout(ajustarContainer, 800); // Pois eh, nao teve jeito...

            // Se a listagem de arquivos estiver vazia, escondemos o container
            if($('.qq-upload-list').children().length <= 1){
                $('.qq-upload-list').hide();
            }
        },
        onSubmit: function(id, fileName)
        {
            //alert('onSubmit!');

            count.files++; // Incrementa o numero de arquivos selecionados
            if(fileLimit && count.files >= fileLimit){
                $('div.qq-upload-button').disable();
                $('div.qq-upload-drop-area').disable();
                if(count.files > fileLimit){
                    count.files--;
                    return false;
                }
            }
            // Ajusta as dimensoes dos thumbs
            setTimeout(ajustarContainer, 800); // Pois eh, nao teve jeito...

            // Se for o primeiro arquivo na listagem, exibimos o container
            if($('.qq-upload-list').children().length >= 0){
                $('.qq-upload-list').show();
            }
        },
        onUpload: function(id, fileName)
        {
            //alert('onUpload!');
        },
        onProgress: function(id, fileName, uploadedBytes, totalBytes)
        {
            //alert('onProgress!');
        },
        onComplete: function(id, fileName, responseJSON)
        {
            //alert('onComplete!');

            if(responseJSON.success){
                count.success++; // Incrementa o numero de arquivos completados com sucesso

                // Coloca a imagem no container apropriado
                appendExtraThumbs(responseJSON.imagens);
                anexarExtraThumbs();
                
                // Remove os inseridos com sucesso da lista principal
                // mantendo-os apenas na lista de extras...
                $('.qq-upload-success').remove();
            }else{
                count.error++; // Incrementa o numero de arquivos com erros
                
                // Exibir?!
                //responseJSON.error
                //responseJSON.msgs
            }
            // Remove o estilo colocado pelo fineUploader
            $('.qq-upload-size').removeAttr('style');
            
            // Inclui classe de sucesso nos arquivos que foram salvos
            $('.qq-upload-success').addClass('alert-success');
            
            // Inclui classe de erro nos arquivos que falharam e os remove 5seg depois
            $('.qq-upload-fail').addClass('alert-error');
            setTimeout(function(){
                $('.qq-upload-fail').fadeOut('slow').remove();
            }, 5000);

            // Ajusta as dimensoes dos thumbs
            setTimeout(ajustarContainer, 800); // Pois eh, nao teve jeito...

            if(count.files == (count.success + count.error)){
                $('div.qq-upload-button').enable();
                $('div.qq-upload-drop-area').enable();
                
                // Nao sei pq as linhas acima nao funcionaram... =(
                $('div.qq-upload-button').removeAttr('disabled');
                $('div.qq-upload-drop-area').removeAttr('disabled');
                
                // Dispara um evento quando o upload de arquivos foi finalizado para todos os arquivos selecionados
                // Ideal para executar acoes personalizadas pos-upload
                $('#'+fineOptions.element.id).trigger('fineuploader-ready',count);
            }
        }
    };

    /**
     * Inclui parametros adicionais aos arquivos enviados
     */
    this.setParams = function(newParams){
        params = newParams;
        manualuploader.setParams(newParams);
    };

    /**
     * Inclui lista de arquivos permitidos e tamanho maximo de arquivo
     */
    this.setValidation = function(allowedExtensions,sizeLimit,maxFiles){
        if(allowedExtensions)
            fineOptions.allowedExtensions = allowedExtensions;
        
        if(sizeLimit)
            fineOptions.sizeLimit = sizeLimit;
        
        if(maxFiles)
            fileLimit = maxFiles;
    };

    /**
     * Ajusta o tamanho das thumbs dentro do container
     */
    ajustarContainer = function(){
        // Ajusta as dimensoes dos thumbs
        $('.container-imgshow').equalWidths();
        $('.container-imgshow').equalHeights();
    };

    anexarExtraThumbs = function(){
        // Se o container de thumbs extras jah existe, coloco as thumbs nele
        // caso contrario, crio o container, antes da listagem principal, e entao coloco os thumbs
        if($('.container-imgshow.extra_thumbs').exist()){
            $('.container-imgshow.extra_thumbs').append(extra_thumbs);
        }else{
            $('.qq-upload-list.container-imgshow').before('<div class="container-imgshow extra_thumbs">'+extra_thumbs+'</div>');
        }
        // As thumbs extras jah estao na tela
        extra_thumbs = '';
    };

    /**
     * Inicializa o uploader
     * Recebe uma div onde seram criados os elementos do uploader
     * e a url que vai realizar a acao de upload para o servidor
     */
    this.initializeUploader = function(element,action){
        // Seta opcoes para o uploader...
        fineOptions.element = element;
        fineOptions.action = action;

        // Check for the various File API support.
        if(window.File && window.FileReader && window.FileList && window.Blob)
        {
            fineOptions.template = tmplThumb.template;
            fineOptions.fileTemplate = tmplThumb.fileTemplate;
        }else{
            fineOptions.template = tmplList.template;
            fineOptions.fileTemplate = tmplList.fileTemplate;
        }

        // Inicializacao do File Uploader...
        manualuploader = new qq.FileUploader(fineOptions);

        // Listagem de arquivos inicia escondida
        $('.qq-upload-list').hide();

        // Se houver thumbs para mostrar, coloca-os no container...
        if(extra_thumbs != ''){
            anexarExtraThumbs();

            // Ajusta as dimensoes dos thumbs
            setTimeout(ajustarContainer, 800); // Pois eh, nao teve jeito...
        }
        
        // Evita funcionalidade caso o botao esteja desabilitado...
        $('div.qq-upload-button').click(function(evt){
            if($(this).attr('disabled') == 'disabled'){
                evt.preventDefault();
                return false;
            }
        });
        
        // Criacao dos thumbs...
        $('input[name="file"]').live('change',function(evt){
            // Check for the various File API support.
            if(window.File && window.FileReader && window.FileList && window.Blob)
            {
                // Cria um blob url a partir de um arquivo
                var cbu = function(file)
                {
                    if (window.URL){return window.URL.createObjectURL(file);}
                    else if (window.webkitURL){return window.webkitURL.createObjectURL(file);}
                    else if (window.createObjectURL){return window.createObjectURL(file);}
                    else if (window.createBlobURL){return window.createBlobURL(file);}
                };
                // Decide se mostra um thumb ou um icone
                var getSrc = function(f){
                    var mime = f.type.split('/');
                    var fileType = mime[0];
                    var fileSubType = mime[1];
                    var fileExt = f.name.split('.').pop();

                    // Pega as informacoes do tipo da imagem
                    return (fileType == 'image') ? cbu(f) : iconsPath+fileExt+'.png';
                }
                var files = evt.target.files; // FileList object
                for (var i = 0, f; f = files[i]; i++)
                {
                    $('.qq-upload-file').each(function(){
                        if($(this).html() == (f.name || f.fileName))
                            $(this).parent().children('img.thumb').attr('src',getSrc(f)).attr('title',(f.name || f.fileName));
                    });
                    
                    // Nao exibe o nome do arquivo na exibicao de thumbnails...
                    $('.qq-upload-file').attr('style', 'display: none;');
                    
                    // Ajusta as dimensoes dos thumbs
                    setTimeout(ajustarContainer, 800); // Pois eh, nao teve jeito...
                }
            }
        });
    };

    /**
     * Realiza o upload dos arquivos para o servidor
     */
    this.startUpload = function(){
        // Se o destaque selecionado for uma imagem jah existente...
        console.log(params.remover.ids);
        if(params.destaque.id || params.remover.ids)
        {
            params.alterar = true; // Indica que eu devo alterar arquivos antigos

            // ... Realizamos uma requisicao para atualizar o elemento como destaque
            $.ajax({
                type: 'GET',
                url: fineOptions.action,
                data: params,
                async: false, // Bloqueia a execução até que a validação esteja pronta
                success: function(response){
                    if(response.success){
                        // ...
                    }else{
                        // ...
                        // Exibir?!
                        //response.error
                        //response.msgs
                    }                    
                },
                error: function(response){
                    // ...
                }
            },'json');
            
            params.alterar = false; // Retorna ao modo normal
        }
        
        if(count.files > 0){
            manualuploader.uploadStoredFiles();
        }else{
            // Dispara um evento quando o upload de arquivos foi finalizado para todos os arquivos selecionados
            // Ideal para executar acoes personalizadas pos-upload
            $('#'+fineOptions.element.id).trigger('fineuploader-ready',count);
        }
    };
    
    /**
     * Cancela um upload, limpando a listagem de arquivos
     */
    this.cancelUpload = function(removerExtraThumbs){
        manualuploader.clearStoredFiles();
        
        // Remove as thumbs dos elementos extras
        if(removerExtraThumbs)
            $('.container-imgshow.extra_thumbs').remove();
            
        // Remove da listagem todos os elementos que foram adicionados...
        //$('.qq-upload-list div.imgshow:not(.imgedit)').remove();
        
        // Se a listagem de arquivos estiver vazia, escondemos o container
        if($('.qq-upload-list').children().length <= 1){
            $('.qq-upload-list').hide();
        }
    };
    
    /**
     * Cria thumbnails que seram exibidas no container de imagens.
     * Serve basicamente para exibir as imagens jah cadastradas de um elemento que
     * esteja em edicao.
     * Essas thumbs tem um comportamento proprio, diferente das thumbs que o Fine Uploader
     * cria. Ao clicar em fechar thumb, estas thumbs ficam marcadas para serem deletadas
     * do sistema e nao simplesmente sao fechadas...
     */
    appendExtraThumbs = function(jsonImages){
        var imagens;
        if(typeof(jsonImages) != 'object'){
            imagens = $.parseJSON(jsonImages);
        }else{
            imagens = jsonImages;
        }
        if(imagens.count > 0){
            $.each(imagens.imgs,function(index, img){
                 var el = '<div class="imgedit imgshow thumbnail">' +
                            '<button class="close" data-dismiss="imgshow" type="button">×</button>'+
                            '<img class="thumb" src="'+baseUrlforImages+img.img_nome+'" title="'+img.img_nome+'"/>'+
                            '<span class="qq-upload-file" style="display: none;">'+img.img_nome+'</span>'+
                            '<span class="img-id" style="display: none;">'+img.img_id+'</span>'+
                            '<hr style="margin: 10px 0;" />'+
                            '<span class="thumb-extra">'+
                            '<label class="radio"><input type="radio" name="img-destaque" '+((img.img_destaque == 1) ? 'checked="checked"' : '')+'/>Destaque</label>'+
                            '</span>'+
                          '</div>';
                 extra_thumbs += el;
            });
        }
    }
    /**
     * Torna a funcao appendExtraThumbs() publica. Desta forma, ela
     * pode ser acessada externamente - Eh um xunxo, eu sei... =(
     */
    this.setExtraThumbs = function(jsonImages){
        appendExtraThumbs(jsonImages);
    }
}