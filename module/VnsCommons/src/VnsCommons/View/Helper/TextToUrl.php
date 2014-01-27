<?php
/**
 * TextToUrl - Converte um texto em url amigavel
 * Fonte: http://stackoverflow.com/a/4054740/1003020
 * 
 * @author    Vinicius Oliveira Garcia
 * @version   0.0.1
 * @package   VnsCommons
 * @copyright Copyright (c) 1987-2012 Vinicius Oliveira Garcia
 */
namespace VnsCommons\View\Helper;

use Zend\View\Helper\AbstractHelper;
 
class TextToUrl extends AbstractHelper
{
    public function __invoke($texto,$blankto = '-')
    {
        // First I convert the string to htmlentities just to make it easier to use later
        $friendlyURL = htmlentities($texto, ENT_COMPAT, 'UTF-8', false);
        // Then I replace latin characters with their corresponding ascii characters (á becomes a, Ü becomes U, and so on)
        $friendlyURL = preg_replace('/&([a-z]{1,2})(?:acute|lig|grave|ring|tilde|uml|cedil|caron);/i','\1',$friendlyURL);
        // Then I convert the string back from html entities to symbols, again for easier use later
        $friendlyURL = html_entity_decode($friendlyURL,ENT_COMPAT, 'UTF-8');
        
        // Next I replace all non alphanumeric characters into hyphens
        //$friendlyURL = preg_replace('/[^a-z0-9-]+/i', '-', $friendlyURL);
        // Retiro todos os nao alfanumericos
        $friendlyURL = preg_replace('/[^a-z0-9- ]+/i', '', $friendlyURL);
        // Troco todos os brancos por hifens
        $friendlyURL = preg_replace('/[ ]+/i', '-', $friendlyURL);
        
        // I remove extra hyphens inside the string
        $friendlyURL = preg_replace('/-+/', '-', $friendlyURL);
        // I remove leading and trailing hyphens
        $friendlyURL = trim($friendlyURL, '-');
        
        // And finally convert all into lowercase
        //$friendlyURL = strtolower($friendlyURL);
        
        // Aqui decide qual simbolo utilizar para separar as palavras
        if($blankto != '-')
            $friendlyURL = preg_replace('/-/', $blankto, $friendlyURL);
        
        return $friendlyURL;
    }
}