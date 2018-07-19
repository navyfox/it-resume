<?php

/**
 * @file
 * Contains \Drupal\api_v2\Controller\TestAPIController.
 */

namespace Drupal\api_v2\Controller;

use Drupal\Core\Controller\ControllerBase;

use Drupal\node\NodeInterface;
use Drupal\rest\ResourceResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use \Drupal\node\Entity\Node;
use \Drupal\file\Entity\File;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

use Drupal\Core\Url;
use Psr\Log\LoggerInterface;

/**
 * Controller routines for test_api routes.
 */
class TestAPIController extends ControllerBase {


  /**
   * A current user instance.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  /**
   * Default limit entities per request.
   */
  protected $limit = 4;

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
        $container->getParameter('serializer.formats'),
        $container->get('logger.factory')->get('demo_resource'),
        $container->get('current_user')
    );
  }

  /**
   * Responds to GET requests.
   */
  public function get_resume() {
//    if (!$this->currentUser->hasPermission('access content')) {
//      throw new AccessDeniedHttpException();
//    }

    $response = [
        'items' => [],
        'next_page' => FALSE,
        'prev_page' => FALSE,
    ];
    $request = \Drupal::request();
    $request_query = $request->query;
    $request_query_array = $request_query->all();
    $limit = $request_query->get('limit') ?: $this->limit;
    $page = $request_query->get('page') ?: 0;

    // Find out how many articles do we have.
    $query = \Drupal::entityQuery('node')->condition('type', 'resume');
    $articles_count = $query->count()->execute();
    $position = $limit * ($page + 1);
    if ($articles_count > $position) {
      $next_page_query = $request_query_array;
      $next_page_query['page'] = $page + 1;
      $response['next_page'] = Url::createFromRequest($request)
          ->setOption('query', $next_page_query)
          ->toString(TRUE)
          ->getGeneratedUrl();
    }

    if ($page > 0) {
      $prev_page_query = $request_query_array;
      $prev_page_query['page'] = $page - 1;
      $response['prev_page'] = Url::createFromRequest($request)
          ->setOption('query', $prev_page_query)
          ->toString(TRUE)
          ->getGeneratedUrl();
    }

    // Find articles.
    $query = \Drupal::entityQuery('node')
        ->condition('type', 'resume')
        ->sort('created', 'DESC')
        ->pager($limit);
    $result = $query->execute();
    $articles = \Drupal::entityTypeManager()
        ->getStorage('node')
        ->loadMultiple($result);

    /** @var \Drupal\node\Entity\Node $article */
    foreach ($articles as $article) {
      $response_item = [
          'title' => $article->label(),
          'field_first_name' => "vfdvdf",
          'field_last_name'=> $article->field_last_name->value,
          'field_skills' => $article->field_skills->value,
          'field_s2' => $article->field_s2,
      ];
      $response_item['field_tags'] = [];
      foreach($article->field_tags->getIterator() as $tagItem)
      {
        $term = \Drupal\taxonomy\Entity\Term::load($tagItem->target_id);
        $response_item['field_tags'][] = $term->getName();
      }
      $response['items'][] = $response_item ;
    }

    return new JsonResponse($response, 200);
  }
  /**
   * Callback for `my-api/get.json` API method.
   */
  public function get_example( Request $request ) {

    $response['data'] = 'Some test data to return';
    $response['method'] = 'GET';

    return new JsonResponse( $response );
  }

  /**
   * Callback for `my-api/put.json` API method.
   */
  public function put_example( Request $request ) {

    $response['data'] = 'Some test data to return';
    $response['method'] = 'PUT';

    return new JsonResponse( $response );
  }

  /**
   * Callback for `my-api/post.json` API method.
   */
  public function post_resume( Request $request ) {

    // This condition checks the `Content-type` and makes sure to 
    // decode JSON string from the request body into array.
    if ( 0 === strpos( $request->headers->get( 'Content-Type' ), 'application/json' ) ) {
      $data = json_decode( $request->getContent(), TRUE );
      $request->request->replace( is_array( $data ) ? $data : [] );
    }

    $response['data'] = $data;
    $response['method'] = 'POST';

    $node = Node::create([
        'type'        => 'resume',
        'title'       => $data['title'],
        'field_first_name' => $data['field_first_name'],
        'field_last_name'=> $data['field_last_name'],
        'field_skills' => $data['field_skills'],
    ]);
    $node->save();

    return new JsonResponse( $response );
  }


  /**
   * Callback for `my-api/edit` API method.
   */
  public function edit_resume( NodeInterface $node, Request $request ) {

    // This condition checks the `Content-type` and makes sure to
    // decode JSON string from the request body into array.
    if ( 0 === strpos( $request->headers->get( 'Content-Type' ), 'application/json' ) ) {
      $data = json_decode( $request->getContent(), TRUE );
      $request->request->replace( is_array( $data ) ? $data : [] );
    }

//    $request_query = $request->query;

    $response['data'] = $data;
    $response['method'] = 'POST';

//    $node = Node::load($node->id());
//    var_dump($node); die();
    $node->title = $data['title'];
    $node->save();

    return new JsonResponse( $response );
  }

  public function get_node (NodeInterface $node) {
//    $node = Node::load($data['uid']);
    return new JsonResponse( $node->id() );
  }

  /**
   * Callback for `my-api/delete.json` API method.
   */
  public function delete_example( Request $request ) {

    $response['data'] = 'Some test data to return';
    $response['method'] = 'DELETE';

    return new JsonResponse( $response );
  }

}
