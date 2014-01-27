<?php
/**
 * TextShrink - Encurtador de textos
 * Fonte: http://www.igorescobar.com/blog/2011/09/19/abreviando-um-texto-sem-cortar-palavras-no-php/
 * 
 * @author    Vinicius Oliveira Garcia
 * @version   0.0.1
 * @package   VnsCommons
 * @copyright Copyright (c) 1987-2012 Vinicius Oliveira Garcia
 */
namespace VnsCommons\View\Helper;

use Zend\View\Helper\AbstractHelper;
 
class TextShrink extends AbstractHelper
{
    private function somenteTexto($string)
    {
        $trans_tbl = get_html_translation_table(HTML_ENTITIES);
        $trans_tbl = array_flip($trans_tbl);
        return trim(strip_tags(strtr($string, $trans_tbl)));
    }
    
    public function __invoke($texto, $limite, $tres_p = '...')
    {
        $totalCaracteres = 0;
        //Retorna o texto em plain/text
        $texto = $this->somenteTexto($texto);
        //Cria um array com todas as palavras do texto
        $vetorPalavras = explode(" ",$texto);
        if(strlen($texto) <= $limite):
            $tres_p = "";
            $novoTexto = $texto;
        else:
            //Começa a criar o novo texto resumido.
            $novoTexto = "";
            //Acrescenta palavra por palavra na string enquanto ela
            //não exceder o tamanho máximo do resumo
            for($i = 0; $i <count($vetorPalavras); $i++):
                $totalCaracteres += strlen(" ".$vetorPalavras[$i]);
                if($totalCaracteres <= $limite)
                    $novoTexto .= ' ' . $vetorPalavras[$i];
                else break;
            endfor;
        endif;
        return $novoTexto . $tres_p;
    }
}