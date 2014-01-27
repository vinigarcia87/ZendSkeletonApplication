<?php
/**
 * VnsExperimental
 *
 * @copyright Copyright (c) 2012-2013 Vinicius Oliveira Garcia
 */

namespace VnsExperimental\Controller;

use Doctrine\ORM\EntityManager;

use VnsExperimental\Business\Entity\Foo,
    VnsExperimental\Business\Entity\Bar;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class DoctrineController extends AbstractActionController
{
    /**
     * @var EntityManager
     */
    protected $entityManager;

    /**
     * Sets the EntityManager
     *
     * @param EntityManager $em
     * @access protected
     * @return PostController
     */
    protected function setEntityManager(EntityManager $em)
    {
        $this->entityManager = $em;
        return $this;
    }

    /**
     * Returns the EntityManager
     *
     * Fetches the EntityManager from ServiceLocator if it has not been initiated
     * and then returns it
     *
     * @access protected
     * @return EntityManager
     */
    protected function getEntityManager()
    {
        if (null === $this->entityManager) {
            $this->setEntityManager($this->getServiceLocator()->get('Doctrine\ORM\EntityManager'));
        }
        return $this->entityManager;
    }
	
    public function indexAction()
    {
        $formManager = $this->getServiceLocator()->get('FormElementManager');
        $form = $formManager->get('VnsExperimental\Form\CriarFoo');

        // Create a new, empty entity and bind it to the form
        $foo = new Foo();
        $form->bind($foo);

        if ($this->request->isPost()) {
            $form->setData($this->request->getPost());

            if ($form->isValid()) {
                $this->getEntityManager()->persist($foo);
                $this->getEntityManager()->flush();
            }
        }

        return new ViewModel(array(
            'foo' => $foo,
            'form' => $form,
        ));
    }
    
    public function barAction()
    {
    	$bars = $this->getEntityManager()->getRepository("VnsExperimental\Business\Entity\Bar")->findAll();
    	
    	$formManager = $this->getServiceLocator()->get('FormElementManager');
    	$form = $formManager->get('VnsExperimental\Form\CriarFoo');
    	 
    	// Create a new, empty entity and bind it to the form
    	$bar = new Bar();
    	$form->bind($bar);
    	 
    	if ($this->request->isPost()) {
            $form->setData($this->request->getPost());

            if ($form->isValid()) {
                $this->getEntityManager()->persist($bar);
                $this->getEntityManager()->flush();
            }
    	}

    	return new ViewModel(array(
            'bars' => $bars,
            'bar' => $bar,
            'form' => $form,
    	));
    }
}
