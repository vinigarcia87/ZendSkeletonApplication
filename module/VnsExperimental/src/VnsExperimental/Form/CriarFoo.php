<?php
namespace VnsExperimental\Form;

use Zend\Form\Form;

use VnsExperimental\Business\Entity\Foo;

use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;

use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\ServiceManager\ServiceLocatorAwareInterface;

class CriarFoo extends Form implements ServiceLocatorAwareInterface
{
    /**
     * @var $serviceLocator
     */
    protected $serviceLocator;

    /**
     * Set service locator
     *
     * @param ServiceLocatorInterface $serviceLocator
     */
    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        /**
         * FormElementProviderInterface injeta uma instancia de Zend\Form\FormElementManager
         * no metodo setServiceLocator() dos objetos invokables em Module.php
         *
         * @see https://github.com/doctrine/DoctrineModule/issues/178
         */
        /* @var $formElementManager Zend\Form\FormElementManager */
        $formElementManager = $serviceLocator;

        /* @var $serviceManager Zend\ServiceManager\ServiceManager */
        $serviceManager = $formElementManager->getServiceLocator();

        $this->serviceLocator = $serviceManager;
    }

    /**
     * Get service locator
     *
     * @return ServiceLocatorInterface
     */
    public function getServiceLocator()
    {
        return $this->serviceLocator;
    }

    public function __construct()
    {
        parent::__construct('criar-foo');
    }

    public function init()
    {
        $entityManager = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $this->setHydrator(new DoctrineHydrator($entityManager, 'VnsExperimental\Business\Entity\Foo'))->setObject(new Foo());

        $this->setAttribute('method', 'post')
             ->setAttribute('accept-charset', 'UTF-8');

        $this->add(array(
            'name' => 'foo',
            'type' => 'FooFieldset',
            'options' => array(
                'use_as_base_fieldset' => true
            )
        ));

        $this->add(array(
            'name' => 'submit',
            'attributes' => array(
                'type' => 'submit',
                'value' => 'Inscrever!',
            )
        ));
    }
}