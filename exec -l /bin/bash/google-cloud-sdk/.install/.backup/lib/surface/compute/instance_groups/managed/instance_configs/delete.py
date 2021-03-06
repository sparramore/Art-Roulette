# -*- coding: utf-8 -*- #
# Copyright 2017 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

"""Command for deleting managed instance group."""

from __future__ import absolute_import
from __future__ import unicode_literals
from googlecloudsdk.api_lib.compute import base_classes
from googlecloudsdk.api_lib.compute import managed_instance_groups_utils
from googlecloudsdk.api_lib.compute.operations import poller
from googlecloudsdk.api_lib.util import waiter
from googlecloudsdk.calliope import arg_parsers
from googlecloudsdk.calliope import base
from googlecloudsdk.command_lib.compute import flags
from googlecloudsdk.command_lib.compute import scope as compute_scope
from googlecloudsdk.command_lib.compute.instance_groups import flags as instance_groups_flags
from googlecloudsdk.command_lib.compute.instance_groups.managed.instance_configs import instance_configs_messages
from googlecloudsdk.core import properties
from six.moves import map


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class Delete(base.DeleteCommand):
  """Delete per instance configs from managed instance group.

  *{command}* deletes one or more per instance configs from a Google Compute
  Engine managed instance group.
  """

  @staticmethod
  def Args(parser):
    instance_groups_flags.MULTISCOPE_INSTANCE_GROUP_MANAGER_ARG.AddArgument(
        parser, operation_type='delete')
    instance_groups_flags.AddMigStatefulForceInstanceUpdateFlag(parser)
    parser.add_argument(
        '--instances',
        metavar='INSTANCE',
        required=True,
        type=arg_parsers.ArgList(min_length=1),
        help='Names of instances to delete instance-configs from.')

  @staticmethod
  def _GetDeletePerInstanceConfigRequests(holder, igm_ref, instances):
    """Returns a delete message for instance group manager."""

    messages = holder.client.messages
    req = messages.InstanceGroupManagersDeletePerInstanceConfigsReq(
        instances=instances)
    return messages.ComputeInstanceGroupManagersDeletePerInstanceConfigsRequest(
        instanceGroupManager=igm_ref.Name(),
        instanceGroupManagersDeletePerInstanceConfigsReq=req,
        project=igm_ref.project,
        zone=igm_ref.zone,
    )

  @staticmethod
  def _GetRegionDeletePerInstanceConfigRequests(holder, igm_ref, instances):
    """Returns a delete message for regional instance group manager."""

    messages = holder.client.messages
    req = messages.RegionInstanceGroupManagerDeleteInstanceConfigReq(
        instances=instances)
    return (messages.
            ComputeRegionInstanceGroupManagersDeletePerInstanceConfigsRequest)(
                instanceGroupManager=igm_ref.Name(),
                regionInstanceGroupManagerDeleteInstanceConfigReq=req,
                project=igm_ref.project,
                region=igm_ref.region,
            )

  def Run(self, args):
    holder = base_classes.ComputeApiHolder(self.ReleaseTrack())
    project = properties.VALUES.core.project.Get(required=True)

    igm_ref = (instance_groups_flags.MULTISCOPE_INSTANCE_GROUP_MANAGER_ARG.
               ResolveAsResource)(
                   args,
                   holder.resources,
                   default_scope=compute_scope.ScopeEnum.ZONE,
                   scope_lister=flags.GetDefaultScopeLister(
                       holder.client, project))

    instances = list(map(str,
                         managed_instance_groups_utils.CreateInstanceReferences(
                             holder, igm_ref, args.instances)))

    if igm_ref.Collection() == 'compute.instanceGroupManagers':
      operation_collection = 'compute.zoneOperations'
      service = holder.client.apitools_client.instanceGroupManagers
      delete_request = self._GetDeletePerInstanceConfigRequests(
          holder, igm_ref, instances)
    else:
      operation_collection = 'compute.regionOperations'
      service = holder.client.apitools_client.regionInstanceGroupManagers
      delete_request = self._GetRegionDeletePerInstanceConfigRequests(
          holder, igm_ref, instances)

    operation = service.DeletePerInstanceConfigs(delete_request)
    operation_ref = holder.resources.Parse(
        operation.selfLink, collection=operation_collection)

    operation_poller = poller.Poller(service)
    delete_result = waiter.WaitFor(operation_poller, operation_ref,
                                   'Deleting instance configs.')

    if args.force_instance_update:
      apply_operation_ref = (
          instance_configs_messages.CallApplyUpdatesToInstances)(
              holder=holder, igm_ref=igm_ref, instances=instances)
      return waiter.WaitFor(operation_poller, apply_operation_ref,
                            'Applying updates to instances.')
    return delete_result
