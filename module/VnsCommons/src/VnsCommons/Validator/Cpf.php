<?php
/**
 * Cpf - Validador de CPF
 * Fonte: http://www.geradorcpf.com/script-validar-cpf-php.htm
 * 
 * @author    Vinicius Oliveira Garcia
 * @version   0.0.1
 * @package   VnsCommons
 * @copyright Copyright (c) 1987-2012 Vinicius Oliveira Garcia
 */
namespace VnsCommons\Validator;

use Zend\Validator\AbstractValidator;

class Cpf extends AbstractValidator
{
    const INVALID = 'invalid';

    protected $messageTemplates = array(
        self::INVALID => "'%value%' não é um CPF válido"
    );

    public function isValid($value)
    {
        // Elimina possivel mascara
        $value = preg_replace('/[^0-9]/', '', $value);
        $value = str_pad($value, 11, '0', STR_PAD_LEFT);
        
        $this->setValue($value);

        if (!is_numeric($value))
        {
            $this->error(self::INVALID);
            return false;
        }

        // Verifica se o numero de digitos informados é igual a 11
        if (strlen($value) != 11) {
            $this->error(self::INVALID);
            return false;
        }
        // Verifica se nenhuma das sequências invalidas abaixo foi digitada. Caso afirmativo, retorna falso
        if ($value == '00000000000' ||
            $value == '11111111111' ||
            $value == '22222222222' ||
            $value == '33333333333' ||
            $value == '44444444444' ||
            $value == '55555555555' ||
            $value == '66666666666' ||
            $value == '77777777777' ||
            $value == '88888888888' ||
            $value == '99999999999')
        {
            $this->error(self::INVALID);
            return false;
        }
        
        // Calcula os digitos verificadores para verificar se o CPF é válido
        for ($t = 9; $t < 11; $t++)
        {
            for ($d = 0, $c = 0; $c < $t; $c++)
                $d += $value{$c} * (($t + 1) - $c);

            $d = ((10 * $d) % 11) % 10;
            if ($value{$c} != $d)
            {
                $this->error(self::INVALID);
                return false;
            }
        }

        return true;
    }
}