<?php

namespace VnsCommons\Business\Service;

use Zend\ServiceManager\ServiceLocatorAwareInterface,
    Zend\ServiceManager\ServiceLocatorInterface;

class ServiceAbstract implements ServiceLocatorAwareInterface
{
    /**
     * @var ServiceLocatorInterface
     */
    protected $serviceLocator;
    
    /**
     * @var $objectMapper Catalogo\Mapper\MapperAbstract
     */
    protected $objectMapper;
    
    /**
     * Set serviceManager instance
     *
     * @param  ServiceLocatorInterface $serviceLocator
     * @return void
     */
    public function setServiceLocator(ServiceLocatorInterface $serviceLocator)
    {
        $this->serviceLocator = $serviceLocator;
    }

    /**
     * Retrieve serviceManager instance
     *
     * @return ServiceLocatorInterface
     */
    public function getServiceLocator()
    {
        return $this->serviceLocator;
    }
    
    public function getObjectMapper()
    {
        $mapper = reset(explode('\\',get_class($this))).'\\Business\Mapper\\'.str_replace('Service', '',end(explode('\\',get_class($this)))).'Mapper';
        
        if(!$this->objectMapper)
            $this->objectMapper = $this->getServiceLocator()->get($mapper);
        
        return $this->objectMapper;
    }
    
    public function exibirColecao($full = true)
    {
        $objMapper = $this->getObjectMapper();
        if($full)
            $objects = $objMapper->findAllFull();
        else
            $objects = $objMapper->findAll();
        
        return $objects;
    }

    public function exibirElemento($id,$full = true)
    {
        $objMapper = $this->getObjectMapper();
        if($full)
            $object = $objMapper->findOneFull($id);
        else
            $object = $objMapper->findOne($id);
        
        return $object;
    }
    
    public function salvar($object)
    {
        // Se nao tiver id, entao eh um objeto novo
        if($object->id == 0)
            return $this->getObjectMapper()->insert($object);
        else
            return $this->getObjectMapper()->update($object);
    }
    
    public function remover($id)
    {
        if($id)
            return $this->getObjectMapper()->delete($id);
    }
}