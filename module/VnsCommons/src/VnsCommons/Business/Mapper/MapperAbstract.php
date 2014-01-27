<?php
namespace VnsCommons\Business\Mapper;

use VnsCommons\Business\Table\TableAbstract;

class MapperAbstract
{
    /**
     * @var TableAbstract
     */
    protected $objectTable;
    
    public function __construct(TableAbstract $objectTable)
    {
        $this->objectTable = $objectTable;
    }

    public function insert($object)
    {
        $object->id = $this->objectTable->insert($object->getArrayCopy());
        if(!$object->id)
            throw new \Exception('Ocorreu uma falha ao salvar o item');

        return $object;
    }
    
    public function update($object)
    {
        $this->objectTable->update($object->getArrayCopy(),array($this->objectTable->getPrimary() => $object->id));
        return $object;
    }
    
    public function delete($id)
    {
        return $this->objectTable->delete(array($this->objectTable->getPrimary() => (int) $id));
        return true;
    }
    
    public function findAll()
    {
        $objects = $this->objectTable->fetchAll();
        return ( (count($objects) > 0) ? $objects : array() );
    }
    
    public function findAllFull()
    {
        $objects = $this->objectTable->fetchAllWithRelationship();
        return ( (count($objects) > 0) ? $objects : array() );
    }
    
    public function findOne($id)
    {
        $object = $this->objectTable->fetchOne(array($this->objectTable->getPrimary() => (int) $id));
        return $object;
    }
    
    public function findOneFull($id)
    {
        $object = $this->objectTable->fetchOneWithRelationship(array($this->objectTable->getPrimary() => (int) $id));
        return $object;
    }
}