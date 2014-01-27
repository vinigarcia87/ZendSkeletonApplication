<?php
namespace VnsExperimental\Form\Fieldset;

use VnsExperimental\Business\Entity\Foo;

use Zend\Form\Fieldset;

use DoctrineModule\Stdlib\Hydrator\DoctrineObject as DoctrineHydrator;

use Zend\InputFilter\InputFilterProviderInterface;

use Zend\ServiceManager\ServiceLocatorInterface;
use Zend\ServiceManager\ServiceLocatorAwareInterface;

class FooFieldset extends Fieldset implements ServiceLocatorAwareInterface, InputFilterProviderInterface
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
        parent::__construct('foo');
    }

    public function init()
    {
        $entityManager = $this->getServiceLocator()->get('Doctrine\ORM\EntityManager');
        $this->setHydrator(new DoctrineHydrator($entityManager, 'VnsExperimental\Business\Entity\Foo'))->setObject(new Foo());

        $this->add(array(
            'name' => 'nome',
            'type'  => 'Text',
            'attributes' => array(
                'placeholder' => 'Nome do foo',
            ),
            'options' => array(
                'label' => 'Nome',
            ),
        ));
        $this->add(array(
            'name' => 'descricao',
            'type'  => 'Text',
            'attributes' => array(
                'placeholder' => 'Descrição do foo',
            ),
            'options' => array(
                'label' => 'Descrição',
            ),
        ));
    }

    public function getInputFilterSpecification()
    {
        return array(
            'nome' => array(
                'required' => true,
            ),

            'descricao' => array(
                'required' => true,
            )
        );
    }
}