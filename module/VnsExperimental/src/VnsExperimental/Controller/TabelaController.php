<?php
/**
 * VnsExperimental
 *
 * @copyright Copyright (c) 2012-2013 Vinicius Oliveira Garcia
 */

namespace VnsExperimental\Controller;

use Doctrine\ORM\EntityManager;

use VnsExperimental\Business\Entity\Bar;

use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class TabelaController extends AbstractActionController
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
        $bars = $this->getEntityManager()->getRepository("VnsExperimental\Business\Entity\Bar")->findAll();

        return new ViewModel(array(
            'bars' => $bars,
    	));
    }
}
