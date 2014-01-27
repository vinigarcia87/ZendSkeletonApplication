<?php
namespace VnsCommons;

use Zend\Db\ResultSet\ResultSet,
    Zend\Db\TableGateway\TableGateway;

class Module
{
    public function getAutoloaderConfig()
    {
        return array(
            'Zend\Loader\ClassMapAutoloader' => array(
                __DIR__ . '/autoload_classmap.php',
            ),
            'Zend\Loader\StandardAutoloader' => array(
                'namespaces' => array(
                    __NAMESPACE__         => __DIR__ . '/src/' . __NAMESPACE__,
                ),
            ),
        );
    }

    public function onBootstrap($e)
    {
        /**
         * This code allows module-specific layouts
         * source: https://github.com/EvanDotPro/EdpModuleLayouts
         * 
         * In any module config or autoloaded config file simply specify the following
         * array(
         *     'module_layouts' => array(
         *         'ModuleName' => 'layout/some-layout',
         *     ),
         * );
         */
        $e->getApplication()->getEventManager()->getSharedManager()->attach('Zend\Mvc\Controller\AbstractController', 'dispatch', function($e) {
            $controller = $e->getTarget();
            $controllerClass = get_class($controller);
            $moduleNamespace = substr($controllerClass, 0, strpos($controllerClass, '\\'));
            $config = $e->getApplication()->getServiceManager()->get('config');
            if (isset($config['module_layouts'][$moduleNamespace])) {
                $controller->layout($config['module_layouts'][$moduleNamespace]);
            }
        }, 100);
    }
    
    public function getConfig()
    {
        return include __DIR__ . '/config/module.config.php';
    }
    
    // Isso precisa ser revisado...
    public function getServiceConfig()
    {
    	return include __DIR__ . '/config/module.config.php';
    }
}
