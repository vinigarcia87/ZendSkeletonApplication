<?php
/**
 * Mask - Aplica mascaras customizadas a um elemento
 * Fonte: http://clares.com.br/php-mascara-cnpj-cpf-data-e-qualquer-outra-coisa/
 * 
 * @author    Vinicius Oliveira Garcia
 * @version   0.0.1
 * @package   VnsCommons
 * @copyright Copyright (c) 1987-2012 Vinicius Oliveira Garcia
 */
namespace VnsCommons\View\Helper;

use Zend\View\Helper\AbstractHelper;
 
class Mask extends AbstractHelper
{
    public function __invoke($val, $mask)
	{
		if(empty($val))
			return '';
		
		$k = 0;
		$maskared = '';
		for($i = 0; $i <= strlen($mask) - 1; $i++)
		{
			if($mask[$i] == '#')
			{
				if(isset($val[$k]))
					$maskared .= $val[$k++];
			}else
				if(isset($mask[$i]))
					$maskared .= $mask[$i];
		}
		
		return $maskared;
    }
}