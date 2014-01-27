<?php

namespace VnsExperimental\Form;

use Zend\Form\Form;

class TwitterForm extends Form
{
	public function __construct($name = null)
	{
		$name = (isset($name)) ? $name : 'frm';

		parent::__construct($name);
		$this->setAttribute('id', $name);
		$this->setAttribute('method', 'post');
		$this->setAttribute('accept-charset', 'UTF-8');
		//$this->setAttribute('enctype','multipart/form-data'); // Para upload de arquivos

		$this->add(array(
			'name' => 'id',
			'type'  => 'Zend\Form\Element\Hidden',
			'attributes' => array(),
		));
		$this->add(array(
			'name' => 'nome',
			'type'  => 'Zend\Form\Element\Text',
			'attributes' => array(
				'placeholder' => 'Nome da categoria',
			),
			'options' => array(
				'label' => 'Nome',
				//'hint' => 'Hint',
				//'description' => 'Description',
			),
		));
		$this->add(array(
			'name' => 'descricao',
			'type'  => 'Zend\Form\Element\Textarea',
			'attributes' => array(
				'placeholder' => 'Descrição da categoria',
			),
			'options' => array(
				'label' => 'Descrição',
				//'hint' => 'Hint',
				//'description' => 'Description',
			),
		));
		$this->add(array(
			'name' => 'submit',
			'type'  => 'Zend\Form\Element\Submit',
			'attributes' => array(
				'value' => '...',
				'id' => 'submit',
			),
		));
		$this->add(array(
			'name' => 'reset',
			'attributes' => array(
				'type'  => 'reset', // Nao existe um elemento Zend\Form\Element\Reset, entao ele eh colocado dentro de attributes...
				'value' => 'Cancelar',
				'id' => 'reset',
			),
		));
	}
}