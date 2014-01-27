<?php
/**
 * VnsExperimental
 *
 * @copyright Copyright (c) 2012-2013 Vinicius Oliveira Garcia
 */

namespace VnsExperimental\Controller;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class TwtModuleController extends AbstractActionController
{
    public function indexAction()
    {
		// Inicializa o formulario...
		$form = new \VnsExperimental\Form\TwitterForm('frm');
		$form->setAttribute('action', $this->url()->fromRoute('vnsexperimental', array('controller' => 'twtform', 'action' => 'index')));
		$form->get('submit')->setValue('Cadastrar');

		// Inicializa a view model...
		return new ViewModel(array(
			'form' => $form,
		));
    }
}
