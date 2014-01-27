<?php
/**
 * FormatCpfCnpj - Formatador de CPF e CNPJ
 * Fonte: http://webmarcos.net/2008/11/12/funcao-para-formatar-cpfcnpj/
 * 
 * @author    Vinicius Oliveira Garcia
 * @version   0.0.1
 * @package   VnsCommons
 * @copyright Copyright (c) 1987-2012 Vinicius Oliveira Garcia
 */
namespace VnsCommons\View\Helper;

use Zend\View\Helper\AbstractHelper;
 
class FormatCpfCnpj extends AbstractHelper
{
    public function __invoke($campo, $formatado = true)
    {
		// Retira formato
		$codigoLimpo = preg_replace("#[' '-./ t]#", "", $campo);
		
		// Pega o tamanho da string menos os digitos verificadores
		$tamanho = (strlen($codigoLimpo) -2);
		
		// Verifica se o tamanho do código informado é válido
		if($tamanho != 9 && $tamanho != 12)
			return false;

		// Se não quer formatado, retorna o campo limpo
		if(!$formatado)
			return $codigoLimpo;

		// Seleciona a máscara para cpf ou cnpj
		$mascara = ($tamanho == 9) ? '###.###.###-##' : '##.###.###/####-##'; 
	
		$indice = -1;
		for($i=0; $i < strlen($mascara); $i++)
			if($mascara[$i]=='#')
				$mascara[$i] = $codigoLimpo[++$indice];

		// Retorna o campo formatado
		return $mascara;
    }
}